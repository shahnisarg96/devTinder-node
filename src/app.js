require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database.js');
const app = express();
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.js');
const profileRouter = require('./routes/profile.js');
const connectionRouter = require('./routes/connections.js');
const feedRouter = require('./routes/feed.js');
const cors = require('cors');

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', connectionRouter);
app.use('/', feedRouter);

connectDB().then(() => {
    console.log('Database connected successfully');
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
}).catch(err => {
    console.error('Database connection error:', err);
});