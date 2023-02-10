const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware')
const path = require('path');
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schema');
const permissions = require('./utils/permissions')
const db = require('./config/connection');
//sets port if hosted to host url or on local port 3001
const PORT = process.env.PORT || 3001;
const app = express();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})
//creates apollo server using typeDef resolvers and sets context to our authorization page
const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  resolvers,
  context: ({ req }) => {
    return {
      user: req.headers.user || "",
    };
  },
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
  };
  
// Call the async function to start the server
  startApolloServer(typeDefs, resolvers);