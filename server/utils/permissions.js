const { ForbiddenError } = require('apollo-server-express');

const { rule, shield, allow, deny, and, or } = require('graphql-shield');
const { Rule } = require('graphql-shield/typings/rules');

//Rules for auth

const isLoggedInUser = rule({ cache: 'contextual'})(
    async (parent, args, ctx, info) => {
        return ctx.user.role === 'user'
    }
)

const isAdmin = rule({ cache: 'contextual'})(
    async (parent, args, ctx, info) => {
        return ctx.user.role === 'admin'
    }
)

const isGuest = rule({ cache: 'contextual'})(
    async (parent, args, ctx, info) => {
        return ctx.user.role === 'guest'
    }
)

const canSeeUserSenstiveData = rule ({cache: 'strict'})(
    async (parent, args, ctx, info) => {
        return ctx.viewer.id === parent.id
    }
)



//Permissions 

const permissions = shield({
    Query: {
        user: isLoggedInUser,
        me: isLoggedInUser,
        allOrders: isAdmin,
        allUserOrders: isAdmin,
        allProducts: or(isAdmin, isLoggedInUser, isGuest),
        allCategories: or(isLoggedInUser,isAdmin, isGuest),
        deliveryAddress: isAdmin,
        listAllProductsByCategory: or(isLoggedInUser,isGuest, isAdmin)
        
    },

    Mutation: {
        createUser: or(isAdmin, and(isGuest)),
        deleteUser: or(isAdmin, or(isLoggedInUser)),
        login: or(isGuest, isAdmin),
        updateUserEmail: or(isLoggedInUser, isAdmin),
        updateUserAddress: or(isLoggedInUser, isAdmin),
        createProductListing: isAdmin,
        updatedProductListing: isAdmin,
        deleteProduct:isAdmin,
        createCategory: isAdmin,
        deleteCategory: isAdmin,
        createAddress: or(isLoggedInUser, isGuest, isAdmin),
        createCart: or(isLoggedInUser, isGuest, isAdmin),
        updateCartAdd: or(isLoggedInUser, isGuest, isAdmin),
        updateCartDelete: or(isLoggedInUser, isGuest, isAdmin),
        
    },
})

module.exports = {permissions};