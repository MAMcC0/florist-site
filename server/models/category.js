const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
    title: {
        type: String,

    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    tagline: {
        type: String,
    }
});

const Category = model('Category', categorySchema);

module.exports = Category;