const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); // For serving static files
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve the static HTML page (like profilepage.html)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/CareerMonks')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define your User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  institute: String,
  age: Number,
  dob: Date,
  profilePhoto: String // You can store a URL or path to the image here
});

const User = mongoose.model('User', userSchema);

// API route to handle profile creation or updates
app.post('/api/signup', async (req, res) => {
  const { name, email, password, phone, institute, age, dob, profilePhoto } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      password,
      phone,
      institute,
      age,
      dob,
      profilePhoto
    });

    await newUser.save();

    res.status(201).json({ message: 'Profile created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fallback route to serve your main page (e.g., profilepage.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profilepage.html')); // Adjust if needed
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
