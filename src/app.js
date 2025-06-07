const express = require('express');

const app = express();

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

app.use("/test", (req, res) => {
    res.send('Hello, qwe!');
});