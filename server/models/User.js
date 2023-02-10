const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

//model for user account, will not be required to exists for an order
//to go through
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match:[/.+@.+\..+/, 'Must match an email address!'],
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [0-9, "Please include only numbers"],
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    cart: [
        {
            type: Schema.Types.ObjectId,
            ref: "Cart",
        },
    ],
});

//hashes the users password pre save to database for security
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')){
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

//compares hashed password to entered password on login to see if they match
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;