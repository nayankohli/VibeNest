const { User } = require('../models/user.js');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken.js');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
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

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      password: user.password,
      profileImage: user.profileImage,
      banner: user.banner,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Email or Password');
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name: '',
    username,
    email,
    password,
    profileImage: '',
    banner: '',
    bio: '',
    followers: [],
    following:[],
    posts: [],
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      password: user.password,
      profileImage: user.profileImage,
      banner: user.banner,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Update text fields
    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;
    user.bio = req.body.bio || user.bio;

    // Update profileImage if uploaded
    if (req.files && req.files.profileImage) {
      user.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
    }

    // Update banner if uploaded
    if (req.files && req.files.banner) {
      user.banner = `/uploads/${req.files.banner[0].filename}`;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      bio: updatedUser.bio,
      profileImage: updatedUser.profileImage,
      banner: updatedUser.banner,
      followers: updatedUser.followers,
      following: updatedUser.following,
      posts: updatedUser.posts,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { registerUser, authUser, updateUserProfile, upload };
