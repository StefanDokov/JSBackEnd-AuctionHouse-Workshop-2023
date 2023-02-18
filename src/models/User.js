const mongoose = require('mongoose');
const { isEmail } = require('validator');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true,"First name is required"],
        minLength: 1,
    },
    lastName: {
        type: String,
        required: [true,"Last name is required"],
        minLength: 1,
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        validate: [ isEmail, 'Invalid email!' ]
    },
    password: {
        type: String,
        required: [true,"Password is required"],
        minLength: 5,
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;
