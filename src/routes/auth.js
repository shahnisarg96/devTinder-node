const express = require('express');
const authRouter = express.Router();
const User = require('../models/user.js');
const { validateSignup } = require('../utils/validator.js');
const bcrypt = require('bcrypt');

authRouter.post('/signup', async (req, res) => {
    const isValid = validateSignup(req.body);
    if (!isValid.valid) {
        return res.status(400).json({ message: 'Validation failed', errors: isValid.message });
    }

    const password = await bcrypt.hash(req.body.password, 10);

    const user = new User({ ...req.body, password });

    try {
        const newUser = await user.save();
        const token = newUser.getJWT();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({ message: 'Bad request', error });
    }
});

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = user.getJWT();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

authRouter.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
});

module.exports = authRouter;