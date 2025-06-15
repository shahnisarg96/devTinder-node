const validator = require('validator');

const validateSignup = (data) => {
    const { firstName, lastName, email, password } = data;

    if (!firstName || typeof firstName !== 'string' || firstName.length < 4 || firstName.length > 20) {
        return { valid: false, message: 'First name must be a string between 4 and 20 characters.' };
    }

    if (!lastName || typeof lastName !== 'string' || lastName.length < 4 || lastName.length > 20) {
        return { valid: false, message: 'Last name must be a string between 4 and 20 characters.' };
    }

    if (!email || typeof email !== 'string' || !validator.isEmail(email)) {
        return { valid: false, message: 'Invalid email address.' };
    }

    if (!password || typeof password !== 'string' || !validator.isStrongPassword(password)) {
        return { valid: false, message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol.' };
    }
    return { valid: true };
};

const validateProfile = (data) => {
    const allowedFields = ['firstName', 'lastName', 'age', 'gender', 'about', 'profilePicture', 'skills'];
    for (const key of Object.keys(data)) {
        if (!allowedFields.includes(key)) {
            return { valid: false, message: `Invalid field: ${key}` };
        }
    }

    const { firstName, lastName, age, gender, about, profilePicture, skills } = data;

    if (!firstName || typeof firstName !== 'string' || firstName.length < 4 || firstName.length > 20) {
        return { valid: false, message: 'First name must be a string between 4 and 20 characters.' };
    }

    if (!lastName || typeof lastName !== 'string' || lastName.length < 4 || lastName.length > 20) {
        return { valid: false, message: 'Last name must be a string between 4 and 20 characters.' };
    }

    if (age && (typeof age !== 'number' || age < 0)) {
        return { valid: false, message: 'Invalid age. Age must be a positive number.' };
    }

    if (gender && !['male', 'female', 'other'].includes(gender)) {
        return { valid: false, message: 'Invalid gender. Gender must be male, female, or other.' };
    }

    if (about && typeof about !== 'string') {
        return { valid: false, message: 'About must be a string.' };
    }

    if (profilePicture && typeof profilePicture !== 'string') {
        return { valid: false, message: 'Profile picture must be a string.' };
    }

    if (skills && !Array.isArray(skills)) {
        return { valid: false, message: 'Skills must be an array of strings.' };
    }

    return { valid: true };
};

module.exports = {
    validateSignup,
    validateProfile
};