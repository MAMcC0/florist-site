const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    images: [{
        type: String,
        required: true,
    }],
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
    },
    description: {
        type: String,
        required: true,
    },
    inStock: {
        type: Boolean,
        default: true
    }
});

const Product = model("Product", productSchema);

module.exports = Product;