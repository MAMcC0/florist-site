const { Schema, model, Mongoose } = require('mongoose');



const cartSchema = new Schema({
    allCartProducts: [{
        type: Mongoose.Types.ObjectId,
        ref: 'Product'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    updated: new Date,
    created: {
        type: Date,
        default: Date.now,
    },
    subtotalPrice: {
        type: Number,
        default: 0.00
    },
    totalTax: {
        type: Number,
        default: 0.00,
    },
    totalWithTax: {
        type: Number,
        default: 0.00
    },
});

const Cart = model("Cart", cartSchema);

module.exports = Cart;