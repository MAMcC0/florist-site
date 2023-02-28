const db = require('../config/connection');

//models
const {
    User,
    Order,
    Product,
    Category,
    Cart,
    Address
} = require('../models');

//json files for seeding data base
const addresses = require('./address.json');
const categories = require('./categories.json')
const userSeeds = require('./users.json');
const products = require('./products.json');

db.once('open', async () => {
    //deletes seeds if some already exists

    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Category.deleteMany({});
    await Cart.deleteMany({});
    await Address.deleteMany({});


    //having an issue with passwords because trying to hash ones without passwords, need to set conditional before
    //prefunction?
    //create user seeds
    const users = await User.create(userSeeds);

    //loops through for each address and creates address

    for (let i = 0; i < addresses.length; i++) {
        const { _id } = await Address.create(addresses[i]);
        const addressSeeds = await User.findOneAndUpdate(
            { _id: users[Math.floor(Math.random() * users.length)]._id },
            {
                $addToSet: {
                    address: _id,
                },
            }
        );
    }

    //if users role === user need to fill up a order history with randomized products

    //seed categories
    const category = await Category.create(categories);


    //for products need to create then and randomize products to be put in diff categories

    for (let i = 0; i < products.length; i++) {
        const { _id } = await Product.create(products[i]);
        const productSeeds = await Category.findOneAndUpdate(
            { _id: category[Math.floor(Math.random()* category.length)]._id },
            {
                $addToSet: {
                    products: _id,
                },
            }
        );

    };



    //orders go through products and randomly fill, with random quantities unless user roll
    //is admin
    for (let i = 0; i < users.length; i++) {
        const {_id} = [products[Math.floor(Math.random()*products.length)]._id]
        if (users[i].role !== 'admin') {

            if (users[i].role === 'user') {
                const { _id } = await Cart.create({})
                //have to create a nested for loops for products to add to set
                const cartProducts = await Cart.findOneAndUpdate(
                    { _id: _id },
                    {
                        $push: {
                            allCartProducts: [_id]
                        }
                    },
                )

                const userUpdate = await User.findOneAndUpdate(
                    { _id: users[i]._id },
                    {
                        $addToSet:
                            {cart: _id }
                    },
                )

                const orderCreation = await Order.create(
                    {
                        $set: {
                            cart: _id,
                            isProcessed: true
                        }
                    }
                    );
            }

            if(users[i].role === 'guest'){
                const { _id } = await Cart.create({})
                const cartProducts = await Cart.findOneAndUpdate(
                    { _id: _id },
                    {
                        $push: {
                            allCartProducts: [_id]
                        }
                    },
                );

                const orderCreation = await Order.create(
                    {
                        $addToSet: {
                            cart: _id,
                            isProcessed: true
                        }
                    }
                    );
            }

            //may need to go through categories to get to established products,
            //need to access products randomize selection update cart with selection and user id
        }

    }
    console.log("Seeds planted!")
    process.exit(0);

});