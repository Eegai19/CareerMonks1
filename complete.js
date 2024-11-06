const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files

// MongoDB connection (using mongo.js for connection)
require('./mongo.js');

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Import routes from admin.js and pp.js
const adminRoutes = require('./admin.js');
const ppRoutes = require('./pp.js');

// Admin routes (admin.js)
app.use('/admin', adminRoutes);

// User profile routes (pp.js)
app.use('/user', ppRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
