const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 20
    },
    lastName: {
        type: String,
        required: false,
        minlength: 4,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email address'
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: validator.isStrongPassword,
            message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol.'
        }
    },
    age: {
        type: Number,
        required: false,
        min: 18
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: false,
    },
    about: {
        type: String,
        required: false,
        default: 'Default about me'
    },
    profilePicture: {
        type: String,
        required: false,
        default: 'https://www.mauicardiovascularsymposium.com/wp-content/uploads/2019/08/dummy-profile-pic-300x300.png'
    },
    skills: {
        type: [String],
        required: false,
        default: []
    },
}, { timestamps: true });

userSchema.methods.getJWT = function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
}

userSchema.methods.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;
