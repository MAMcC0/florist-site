const { gql } = require('apollo-server-express');

const typeDefs = gql `
    type User {
        _id: ID
        email: String
        phone: String
        name: String
        address: [Address]
        orders: [Order]
        cart: [Cart]
        role: String
    }

    type Product {
        _id: ID
        images: [String]
        price: Int
        quantity: Int
        description: String
        inStock: Boolean
    }

    type Order {
        _id: ID
        isProcessed: Boolean,
        isShipped: Boolean
        isDelivered: Boolean
        isPickup: Boolean
        cart: [Cart]
        user: [User]
        address: [Address]
        updatedAt: String
    }

    type Category {
        _id: ID
        title: String
        products: [Product]
        tagline: String
    }

    type Cart {
        _id: ID
        allCartProducts: [Product]
        user: [User]
        updated: String
        created: String
        subtotalPrice: Int
        totalTax: Int
        totalWithTax: Int
    }

    type Address {
        _id: ID
        streetAddress: String
        secondaryAddress: String
        city: String
        state: String
        zipcode: Int
    }

    input Category {
        title: String
        products: [Product]
        tagline: String
    }

    input Product {
        images: [String!]
        price: Number
        description: String!
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        user(email: String!): User
        me: User
        allOrders: [Order]
        allUserOrders(_id: ID!): [Order]
        allProducts: [Product]
        allCategories: [Category]
        deliveryAddress(_id: ID!): [Order]
        listAllProductsByCategory(_id: ID!): [Category]
    }

    type Mutation {
        createUser(email: String!, password: String!): Auth
        deleteUSer(_id: ID): User
        login(email: String, password: String): Auth
        updateUserEmail(_id: ID, newEmail): User
        updateUserAddress(_id: ID!, newAddress): User
        createProductListing(productInfo: ProductInput) : Admin
        updateProductListing(updatedInfo: ProductInput) : Admin
        deleteProduct(_id: ID!): Admin
        createCategory(categoryInfo: CategoryInput): Admin
        deleteCategory(_id: ID!): Admin
        createAddress(streetAddress: String!, secondaryAddress: String, city: String!, state: String!, zipcode: String!): User
        createCart(cartInfo: CartInput): User
        updateCartAdd(cartInfo: CartInput): User
        updateCartDelete(cartInfo: CartInput): User
    }

`

//need to create product input type
//need to create category input type
// need to create cart input type
