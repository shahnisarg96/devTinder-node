const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth.js');
const { validateProfile } = require('../utils/validator.js');
const User = require('../models/user.js');

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user: req.user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    const isValid = validateProfile(req.body);
    console.log('Profile update validation:', isValid);
    if (!isValid.valid) {
        return res.status(400).json({ message: 'Validation failed', errors: isValid.message });
    }

    try {
        req.user = Object.assign(req.user, req.body);
        await req.user.save();
        res.status(200).json({ message: 'Profile updated successfully', user: req.user });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

module.exports = profileRouter;