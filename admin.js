const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define User Schema for Admin Signup
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    institute: String,
    age: Number,
    dob: Date,
});

// Create User Model
const User = mongoose.model('User', userSchema);

// Admin signup route
router.post('/signup', (req, res) => {
    const { name, email, password, phone, institute, age, dob } = req.body;

    const newUser = new User({
        name,
        email,
        password,
        phone,
        institute,
        age,
        dob,
    });

    newUser.save()
        .then(() => res.status(201).json({ message: 'Admin registered successfully!' }))
        .catch(err => res.status(400).json({ error: err.message }));
});

module.exports = router;
