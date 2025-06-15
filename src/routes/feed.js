const express = require('express');
const feedRouter = express.Router();
const { userAuth } = require('../middlewares/auth.js');
const User = require('../models/user.js');
const ConnectionRequest = require('../models/connections.js');

feedRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        if (limit > 100) limit = 100;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: user._id },
                { toUserId: user._id }
            ]
        }).select('fromUserId toUserId status');

        const blockUsersFromFeed = new Set();
        blockUsersFromFeed.add(user._id.toString());
        connectionRequests.forEach(request => {
            blockUsersFromFeed.add(request.fromUserId._id.toString());
            blockUsersFromFeed.add(request.toUserId._id.toString());
        });

        const feed = await User.find({
            _id: { $nin: Array.from(blockUsersFromFeed) }
        }).select('firstName lastName age gender profilePicture')
            .skip(skip)
            .limit(limit);

        if (feed.length === 0) {
            return res.status(404).json({ message: 'No users found in feed' });
        }

        res.status(200).json({ message: 'Feed fetched successfully', data: feed });
    } catch (error) {
        console.error('Error fetching feed:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

module.exports = feedRouter;