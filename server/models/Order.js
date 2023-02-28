const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    isProcessed: {
        type: Boolean,
        default: false,
    },
    isShipped: {
        type: Boolean,
        default: false,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
    isPickup: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    },
    user: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    updatedAt: {
        type: Date,
    },
    
});

const Order = model('Order', orderSchema);

module.exports = Order;