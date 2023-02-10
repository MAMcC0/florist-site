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
    //TODO: look at how to do password recovery
    //TODO: look at how to do admin auth
    //need create updateCartAdd, updateCartDelete, updateOrder, 
    //  createOrder,  createCart, createAddress,
    //  deleteCart, updateOrderStatus, deleteOrder
    Mutation: {
        createUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },

        login: async (parent, {email, password}) => {
            //find users by email
            const user = await User.findOne({ email });

            if(!user){
                throw new AuthenticationError('No account with that email exists');
            };

            const correctPass = await user.isCorrectPassword(password);
            //checks if password is correct

            if(!correctPass){
                throw new AuthenticationError('Whoops! Incorrect Password!')
            }

            const token = signToken(user);
            return { token, user };
        },

        deleteUser: async (parent, {_id}) => {
            //destroys users account based on id

            const user = await User.destroy(
                { _id },
                { new: true}
            );
            return user;
        },

        updateUserEmail: async (parent, {_id, newEmail}, context) => {
            try {
                if(context.user){
                    const updatedUser = await User.findOneAndUpdate(
                        {_id: _id},
                        {$set: {email: newEmail} },
                        {new: true},
                    )
                    return updatedUser;
                }
            } catch (error) {
                console.log(error)
            }
        },

        updateUserAddress: async (parent, {_id, newAddress}, context) => {
            try {
                if(context.user){
                    const updatedUser = await User.findOneAndUpdate(
                        {_id: _id},
                        {$push: {address: newAddress} },
                        {new: true},
                    )
                    return updatedUser;
                }
            } catch (error) {
                console.log(error)
            }
        },

        createProductListing: async (parent, { productInfo, categoryInfo }, context) => {
            try {
                if(context.user){
                    const productData = await Product.create({
                        images: [productInfo.images], 
                        price: productInfo.price,
                        description: productInfo.description,
                    });

                    const updatedCategoryData = await Category.findOneAndUpdate(
                        {_id: categoryInfo._id},
                        { $push: {products: productData._id}},
                        {new:true},
                    ).populate('products')
                    return updatedCategoryData;
                    
                };
            } catch (error) {
                console.log(error)
            };
        },

        updateProductListing: async (parent, { updatedInfo }, context) => {
            try {
                if(context.user){
                    const updatedProductData = await Product.findOneAndUpdate(
                        {_id: upddatedInfo._id},
                        {$set: {
                            images: [ updatedInfo.images ],
                            price: updatedInfo.price,
                            description: updatedInfo.description,
                        }},
                        {new:true},
                    )  
                    return updatedProductData;             
                 }
                 
                 //may need to also updated category 
            } catch (error) {
                console.log(error);
            }
        },

        deleteProduct: async(parent, {_id}) => {
            const product = await Product.destroy (
                {_id},
                {new: true},
            )
        },
        
       createCategory: async(parent, {categoryInfo}) => {
            const categoryData = await Category.create({
                title: categoryInfo.title,
                tagline: categoryInfo.tagline,
            });

            let updatedCategoryData = await Category.findOneAndUpdate(
                {_id: categoryData._id},
                { $push: { products: categoryInfo.products}},
                { new: true},
            ).populate('products')

            return updatedCategoryData;
       },

       deleteCategory: async (parent, {_id}) => {
            const category = await Category.destroy(
                { _id},
                {new: true},
            );

            return category;
       },

       createAddress: async (parent, {addressInfo}, context) => {
         
        const newAddress = await Address.create({
            streetAddress: addressInfo.streetAddress,
            secondaryAddress: addressInfo.secondaryAddress,
            city: addressInfo.city,
            state: addressInfo.state,
            zipcode: addressInfo.zipcode
        });

        if (context.user){
            updatedUserInfo = await User.findOneAndUpdate(
                {_id: context.user._id},
                {$push: {address: newAddress}},
                {new: true},
            )
            return updatedUserInfo
        }
        return newAddress;
       }, 

       

       




    }
}