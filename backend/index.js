const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session'); 
const {User} = require('./models/user.js');
const path = require('path'); 
const multer=require("multer");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const MongoStore = require('connect-mongo');

app.use(session({
    secret: process.env.SESSION_SECRET || 'jaihind@1480',
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //     secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    //     httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    //     maxAge: 24 * 60 * 60 * 1000 // 1 day
    // }
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
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB size limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (extName && mimeType) return cb(null, true);
        cb(new Error('Only .jpeg, .jpg, and .png files are allowed!'));
    },
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authenticate = (req, res, next) => {
    console.log(req.session);
    if (req.session && req.session.details) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized: Please log in' });
    }
};

app.use((req, res, next) => {
    if (req.session && req.session.details) {
        res.locals.user = req.session.details;
    }
    next();
});



app.get('/', (req, res) => res.send('API running'));

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ 
            name:" ",
            username:username, 
            email:email, 
            password: hashedPassword ,
            profileImage:" ",
            banner:" ",
            bio:" ",
            connections:0,
            posts:0
        });
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

        req.session.details = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            banner: user.banner,
            bio: user.bio,
            connections: user.connections,
            posts: user.posts
        }; 

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/edit-profile', upload.fields([
    { name: 'bannerPhoto', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 }
]), async (req, res) => {
    try {
        const { userId, username, bio } = req.body;
        const bannerPhoto = req.files['bannerPhoto']?.[0]?.path || null;
        const profilePhoto = req.files['profilePhoto']?.[0]?.path || null;

        await Profile.findByIdAndUpdate(userId, {
            username,
            bio,
            ...(bannerPhoto && { banner: bannerPhoto }),
            ...(profilePhoto && { profileImage: profilePhoto })
        });

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/profile/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update other sensitive routes to use `authenticate` middleware
app.get('/api/session-user', authenticate, (req, res) => {
    const { _id,name, username, bio, profileImage, banner, connections, posts} = req.session.details;
    res.json({
        name,
        username,
        bio,
        profilePhoto: profileImage,
        bannerPhoto: banner,
        connections,
        posts,
        userId: _id,
    });
});


app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Could not log out' });
        }// Clear the session cookie
        res.json({ message: 'Logged out successfully' });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.get('/api/session-check',authenticate, (req, res) => {
    console.log(req.session);
    if (req.session.details) {
        return res.status(200).json({ message: 'User is logged in' ,user:req.session.details});
    } else {
        return res.status(401).json({ message: 'User is not logged in' });
    }
});

server.listen(5000, () => console.log('Server running on port 5000'));
