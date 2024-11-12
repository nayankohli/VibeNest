const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session'); 
const User = require('./models/user.js');
const path = require('path'); 

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET || 'jaihind@1480', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use(express.static('../frontend/build')); 

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', (msg) => {
        io.emit('message', msg);
    });

    socket.on('disconnect', () => console.log('Client disconnected'));
});

app.get('/', (req, res) => res.send('API running'));

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        req.session.userId = user._id; 

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.get('/session-check', (req, res) => {
    if (req.session.userId) {
        return res.status(200).json({ message: 'User is logged in' });
    } else {
        return res.status(401).json({ message: 'User is not logged in' });
    }
});

server.listen(5000, () => console.log('Server running on port 5000'));
