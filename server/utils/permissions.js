const { ForbiddenError } = require('apollo-server-express');

const { rule, shield, allow, deny } = require('graphql-shield');

//Rules for auth

const isLoggedInUser = rule({ cache: 'contextual'})(
    async (parent, args, ctx, info) => {
        let isLoggedInUser = ctx.roles.includes('user');
        console.log(`isLoggedInUser = ${isLoggedInUser}`)
        return isLoggedInUser;
    }
)

const isAdmin = rule({ cache: 'contextual'})(
    async (parent, args, ctx, info) => {
        let isAdmin = ctx.roles.includes('admin');
        console.log(`isAdmin = ${isAdmin}`)
        return isAdmin;
    }
)

const isGuest = rule({ cache: 'contextual'})(
    async (parent, args, ctx, info) => {
        let isGuest = ctx.roles.includes('guest');
        console.log(`isGuest = ${isGuest}`)
        return isGuest;
    }
)


//Permissions 

const permissions = shield({
    Query: {
        "*": deny,
        
    }
})

module.exports = {permissions};