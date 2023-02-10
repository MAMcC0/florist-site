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
                const userData = await User.findOne({_id: context.user._id}).select('-__v -password');

                return userData;
            } else {
                throw new AuthenticationError('Not logged in');
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
    //TODO: look at how to do admin auth and guest auth
    // deleteOrder
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
       //need a context for guest 
       createCart: async (parent, {cartInfo}, context) => {
        if(context.user){
            const newCart  = await Cart.create({
                created: Date.now
            });
    
            const updatedCart = await Cart.findOneAndUpdate(
                {_id: newCart._id},
                {$push: {allCartProducts: cartInfo.product._id}},
                {new:true},
            )
    
            const updatedUser = await User.findOneAndUpdate(
                {_id: context.user._id},
                {$push: {cart: newCart._id}}
            )
            return newCart;
        } else {
            throw new AuthenticationError ('You are not allowed to access this content');
        }
       },
       //need to have subtotal calculation,
       //tax calculation
       //total calculation as each item is added 

       //create order needs to pass through all the cart info
       //set status
       //address
       //whether pickup or delivery

       updateCartAdd: async(parent, {cartInfo}, context ) => {
            try {
                if(context.user){
                    const updatedCart = await Cart.findOneAndUpdate(
                        {_id: cartInfo._id},
                        {$push: {allCartProducts: cartInfo.newProduct}},
                        { new: true},
                    )
                // add to subtotal
                //recalculate tax
                // recalculate total with tax
                } else {
                    throw new AuthenticationError("You do not have access to this feature")
                }
            } catch (error) {
                console.log(error)
            }
       },

       updateCartDelete: async (parent, {cartInfo}, context) => {
         try {
            const updatedCart = await Cart.findOneAndUpdate(
                {_id: cartInfo._id},
                {$pull: {allCartProducts: cartInfo.productId}},
                {new: true},
            )
            //need to update subtotal
            //recalculate tax
            //update total
         } catch (error) {
            console.log(error);
         };
       },

       deleteCart: async (parent, {cartInfo}, context) => {
        try {
            if(!context.user || cartInfo.allCartProducts.length < 0){
                const deletedCart = await Cart.destroy(
                    {_id: cartInfo._id},
                    {new: true}
                )
                return deletedCart
            }
        } catch (error) {
            console.log(error)
        }
       },

       createOrder: async (parent, {orderInfo}, context ) => {
        try {
            const newOrder = await Order.create();

            const updatedOrder = await Order.findOneAndUpdate(
                {_id:  newOrder._id},
                { $push: {cart: orderInfo.cart,
                        address: orderInfo.address,
                        user: context._id}},

            ).populate('cart', 'address');

            const updatedUser = await User.findOneAndUpdate(
                {_id: context._id},
                {$push: {order: updatedOrder}},
                {new: true}
            )
        
            return updatedOrder;
        } catch (error) {
            console.log(error)
        }
       },

       updatedOrderStatus: async (parent, {orderStatus}, context) => {
        try {
            if(orderStatus.message === "Processed"){
                const updatedOrder = await Order.findOneAndUpdate(
                    {_id: orderStatus._id},
                    {$set: {isProcessed: true}},
                    { new: true},
                )
                return updatedOrder;
            }
            if (orderStatus.message === 'Shipped'){
                const updatedOrder = await Order.findOneAndUpdate(
                    {_id: orderStatus._id},
                    {$set: {isShipped: true}},
                    { new: true},
                )
                return updatedOrder;
            }
            if (orderStatus.message === 'Delivered'){
                const updatedOrder = await Order.findOneAndUpdate(
                    {_id: orderStatus._id},
                    {$set: {isDelivered: true}},
                    { new: true},
                )
                return updatedOrder;
            }
        } catch (error) {
            console.log(error);
        }
       },

       cancelOrder: async (parent, {orderInfo}, context) => {
            try {
                if(context.user){
                    const cancelledOrder = await Order.destroy(
                        {_id: orderInfo._id},
                        {new: true}
                    )

                    return cancelledOrder;
                } else {
                    throw new AuthenticationError("You are not able to delete this order")
                }
                
            } catch (error) {
                console.log(error)
            }
       },
    }
}

module.exports = resolvers;