const { Schema, model } = require('mongoose');

const addressSchema = new Schema ({
    streetAddress: {
        type: String,
        required: true,
    },
    secondaryAddress: {
        type: String,
    }, 
    city: {
        type:String,
        required: true,
    },
    state: {
        type:String,
        required: true,
    },
    zipcode: {
        type: Number,
        required: true,
    }
});

const Address = model('Address', addressSchema);

module.exports = Address;