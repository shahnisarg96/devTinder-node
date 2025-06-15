const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const userAuth = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies.token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = { userAuth };