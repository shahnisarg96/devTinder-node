const express = require('express');
const connectionRouter = express.Router();
const { userAuth } = require('../middlewares/auth.js');
const User = require('../models/user.js');
const Connection = require('../models/connections.js');

connectionRouter.post('/connection/send/:status/:toUserId', userAuth, async (req, res) => {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    if (!toUserId || !fromUserId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const allowedStatuses = ['interested', 'ignored'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Allowed statuses are: interested, ignored' });
    }

    if (fromUserId == toUserId) {
        return res.status(400).json({ message: 'You cannot send a connection request to yourself' });
    }

    try {
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingConnectionRequest = await Connection.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
        });

        if (existingConnectionRequest) {
            return res.status(400).json({ message: 'Connection request already exists' });
        }

        const connectionRequest = new Connection({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        });

        const data = await connectionRequest.save();
        if (!data) {
            return res.status(500).json({ message: 'Failed to send connection request' });
        }

        res.status(200).json({ message: `${toUser.firstName} ${toUser.lastName} ${status}` });
    } catch (error) {
        console.error('Error sending connection request:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

connectionRouter.post('/connection/review/:status/:toUserId', userAuth, async (req, res) => {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    if (!fromUserId || !toUserId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const allowedStatuses = ['accepted', 'rejected'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Allowed statuses are: accepted, rejected' });
    }

    try {
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const connectionRequest = await Connection.findOneAndUpdate(
            { fromUserId: toUserId, toUserId: fromUserId, status: 'interested' },
            { status: status },
            { new: true }
        );

        if (!connectionRequest) {
            return res.status(404).json({ message: 'Connection request not found or already accepted' });
        }

        res.status(200).json({ message: `Connection request from ${fromUserId} ${status}` });
    } catch (error) {
        console.error('Error accepting connection request:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

connectionRouter.get('/connection/requests', userAuth, async (req, res) => {
    const userId = req.user._id;

    try {
        const connectionRequests = await Connection.find({
            toUserId: userId,
            status: 'interested'
        }).populate('fromUserId', 'firstName lastName profilePicture gender age');

        if (!connectionRequests || connectionRequests.length === 0) {
            return res.status(404).json({ message: 'No connection requests found' });
        }

        res.status(200).json(connectionRequests);
    } catch (error) {
        console.error('Error fetching connection requests:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

connectionRouter.get('/connection/sent', userAuth, async (req, res) => {
    const userId = req.user._id;

    try {
        const sentRequests = await Connection.find({
            fromUserId: userId,
            status: 'interested'
        }).populate('toUserId', 'firstName lastName profilePicture gender age');

        if (!sentRequests || sentRequests.length === 0) {
            return res.status(404).json({ message: 'No sent connection requests found' });
        }

        res.status(200).json(sentRequests);
    } catch (error) {
        console.error('Error fetching sent connection requests:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

connectionRouter.get('/connections', userAuth, async (req, res) => {
    const userId = req.user._id;

    try {
        const acceptedConnections = await Connection.find({
            $or: [
                { fromUserId: userId, status: 'accepted' },
                { toUserId: userId, status: 'accepted' }
            ]
        }).populate('fromUserId', 'firstName lastName gender age profilePicture').populate('toUserId', 'firstName lastName gender age profilePicture');

        if (!acceptedConnections || acceptedConnections.length === 0) {
            return res.status(404).json({ message: 'No accepted connections found' });
        }

        const data = acceptedConnections.map(connection => {
            if (connection.fromUserId._id.toString() === userId.toString()) {
                return {
                    id: connection.toUserId._id,
                    name: connection.toUserId.firstName + ' ' + connection.toUserId.lastName,
                    status: connection.status,
                    gender: connection.toUserId.gender,
                    age: connection.toUserId.age,
                    profilePicture: connection.toUserId.profilePicture
                };
            } else {
                return {
                    id: connection.fromUserId._id,
                    name: connection.fromUserId.firstName + ' ' + connection.fromUserId.lastName,
                    status: connection.status,
                    gender: connection.fromUserId.gender,
                    age: connection.fromUserId.age,
                    profilePicture: connection.fromUserId.profilePicture
                };
            }
        });

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching accepted connections:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

module.exports = connectionRouter;