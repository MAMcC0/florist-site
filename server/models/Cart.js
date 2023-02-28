const { Schema, model} = require('mongoose');



const cartSchema = new Schema({
    allCartProducts: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    updatedAt: Date,
    created: {
        type: Date,
        default: Date,
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