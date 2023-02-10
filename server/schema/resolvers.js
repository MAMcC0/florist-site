const { AuthenticationError } = require('apollo-server-express');
const {
    User,
    Product,
    Order,
    Category,
    Cart,
    Address,
} = require('../models');
const { signToken } = require('../utils/auth');


//resolver object holds queries and mutations

const resolvers = {

    Query: {

        user: async (parent, { email }) => {
            return User.findOne({ email })
                .populate(
                    { path: 'cart' }
                );
        },
        //fix me query
        me: async (parent, args, context) => {
            if (context.user) {

            }
        },
        //TODO: Need all delivery orders
        //query to find all current orders
        allOrders: async (parent) => {
            try {
                //uses find to return every order
                return await Order.find();
            } catch (err) {
                console.log(err);
            }
        },

        //list all users orders
        allUserOrders: async (parent, { _id }, context) => {
            if (context.user) {
                return User.findOne({ _id }).populate({ path: 'orders' })
            } else {
                throw new AuthenticationError('You need to log in to access your order history!');
            }
        },

        allProducts: async (parent) => {
            try {
                return await Product.find();
            } catch (err) {
                console.log(err)
            }
        },

        allCategories: async (parent) => {
            try {
                return await Category.find().populate({path: 'products'});
            } catch (error) {
                console.log(error)
            }
        },

        deliveryAddress: async(parent, {_id}) => {
            try {
                return await Order.find(_id).populate({path:'address'})
            } catch (error) {
                console.log(error)
            }
        },

        listAllProductsByCategory: async (parent, {_id}) => {
            try {
                return await Category.find(_id).populate({path: 'products'})
            } catch (error) {
                console.log(error)
            }
        },

    },

    //need create User, updateCart, updateOrder, 
    // updateProduct, createProduct, createOrder, 
    // createCategory, updateAddress, login, deleteUser, 
    // updateUser, createAddress, deleteProduct, deleteCart, 
    // updateOrderStatus, deleteCategory, deleteOrder, 
    Mutation: {

    }
}