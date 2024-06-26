const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const aes256 = require('aes256');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    username: String,
});

const messageSchema = new mongoose.Schema({
    receiver: String,
    text: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

app.use(express.json());

app.post('/register', async (req, res) => {
    try {
        const username = generateRandomUsername();
        const user = await User.create({ username });
        const token = jwt.sign({ username: user.username }, 'secret_key', { expiresIn: '30d' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/profile', authenticateToken, async (req, res) => {
    try {
        res.json(req.user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/send-message/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { text } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Message text is required' });
        }

        const recipient = await User.findOne({ username });
        if (!recipient) return res.status(404).json({ error: 'Recipient not found' });

        const secretKey = process.env.AES_SECRET_KEY;
        const encryptedText = aes256.encrypt(secretKey, text);

        const message = await Message.create({ receiver: recipient.username, text: encryptedText });

        res.json({ message: 'Message sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/messages', authenticateToken, async (req, res) => {
    try {
        const messages = await Message.find({ receiver: req.user.username });
        
        const decryptedMessages = messages.map(message => {
            const secretKey = process.env.AES_SECRET_KEY;
            const decryptedText = aes256.decrypt(secretKey, message.text);
            return {
                _id: message._id,
                receiver: message.receiver,
                text: decryptedText,
                createdAt: message.createdAt
            };
        });

        res.json(decryptedMessages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/random', async (req, res) => {
    try {
        const messages = require('./messages.json');
        const randomIndex = Math.floor(Math.random() * messages.length);
        res.json({ message: messages[randomIndex].message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function generateRandomUsername() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';
    for (let i = 0; i < 8; i++) {
        username += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return username;
}

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        req.user = decoded;
        next();
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
