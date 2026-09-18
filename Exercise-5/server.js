// Import the Express module
const express = require('express');

// Create an instance of the Express application
const app = express();

const PORT = process.env.PORT || 3000;

// Define a GET route for /Hello
app.get('/Hello', (req, res) => {
    res.send('Hello, World!');
});

// Define a GET route for root /
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
