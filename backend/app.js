// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

// Initialize Express app
const app = express();
app.use(cors());
require('dotenv').config();
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


// Create a Mongoose schema for User
const userSchema = new mongoose.Schema({
    username: String,
});

const messageSchema = new mongoose.Schema({
    receiver: String, // Storing username instead of userId
    text: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

// Middleware to parse JSON requests
app.use(express.json());

// Route to create a new user account
app.post('/register', async (req, res) => {
    try {
        // Generate a random username
        const username = generateRandomUsername();
        const user = await User.create({ username });
        
        // Sign the token with the username
        const token = jwt.sign({ username: user.username }, 'secret_key', { expiresIn: '30d' });
        
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to retrieve user profile
app.get('/profile', authenticateToken, async (req, res) => {
    try {
        res.json(req.user); // Return the decoded token as user profile
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get messages for the authenticated user
app.get('/messages', authenticateToken, async (req, res) => {
    try {
        // Find every message where the receiver matches the authenticated user's username
        const messages = await Message.find({ receiver: req.user.username });
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to send a message to a user
app.post('/send-message/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { text } = req.body;
        
        // Find the recipient user
        const recipient = await User.findOne({ username });
        if (!recipient) return res.status(404).json({ error: 'Recipient not found' });
        
        // Create a new message with the recipient's ID
        const message = await Message.create({ receiver: recipient.username, text });
        
        res.json({ message: 'Message sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/random', async (req, res) => {
    try {
        const messages = require('./messages.json');
        const randomIndex = Math.floor(Math.random() * messages.length);
        res.json({ message: messages[randomIndex].message }); // Assuming each message object has a "message" property
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Function to generate a random username
function generateRandomUsername() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';
    for (let i = 0; i < 8; i++) {
        username += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return username;
}

// Function to authenticate token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        req.user = decoded; // Store the decoded token in req.user
        next();
    });
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
