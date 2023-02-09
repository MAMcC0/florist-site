const { Schema, model, Mongoose } = require('mongoose');
const User = require('./User');

const cartItemSchema = new Schema({
    product: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
],
    quantity: {
        type: Number,
        default: 0,
    },
    itemPrice: {
        type: Number,
        default: 0.00,
    },
});

module.exports = Mongoose.model("CartItem", cartItemSchema);

const cartSchema = new Schema({
    allCartProducts: [{
        type: Mongoose.Types.ObjectId,
        ref: 'CartItem'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: User,
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

module.exports = Mongoose.model('Cart', cartSchema);