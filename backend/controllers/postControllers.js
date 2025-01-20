const { Post } = require('../models/posts.js');
const asyncHandler = require('express-async-handler');
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
    const fileTypes = /jpeg|jpg|png|mp4|mov/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) return cb(null, true);
    cb(new Error('Only .jpeg, .jpg, .png, .mp4, and .mov files are allowed!'));
  },
});

// Create a post with media upload
const createPost = [
  upload.array('media', 5), // Middleware for handling file uploads
  asyncHandler(async (req, res) => {
    console.log('Create Post Endpoint Hit');
    const { caption } = req.body;
console.log(caption);
console.log(req.files);
    if (!req.files || req.files.length > 5) {
      res.status(400);
      throw new Error('You can upload a maximum of 5 media items per post.');
    }

    const mediaPaths = req.files.map((file) => `/uploads/${file.filename}`);

    const post = await Post.create({
      caption,
      media: mediaPaths,
      postedBy: req.user._id,
      comments: [],
      likes: [],
    });
console.log(post);
    if (post) {
      res.status(201).json(post);
    } else {
      res.status(400);
      throw new Error('Invalid post data');
    }
  }),
];

// Like or unlike a post
const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
    } else {
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    }

    await post.save();
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// Add a comment to a post
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    const comment = {
      text,
      commentedBy: req.user._id,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// Fetch all posts
const getAllPosts = asyncHandler(async (req, res) => {
  console.log('Get All Posts Endpoint Hit');
  try {
    const posts = await Post.find()
      .populate('postedBy', 'username profileImage')
      .populate('comments.commentedBy', 'username profileImage');
    console.log(posts);

    if (posts.length > 0) {
      res.json(posts);
    } else {
      console.log('No posts found');
      res.status(404).json([]);
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a post
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    // Check if the logged-in user is the one who created the post or an admin
    if (post.postedBy.toString() === req.user._id.toString() || req.user.isAdmin) {
      await post.remove(); // Delete the post
      res.json({ message: 'Post deleted successfully' });
    } else {
      res.status(401);
      throw new Error('You are not authorized to delete this post');
    }
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// Export all controllers
module.exports = {
  createPost,
  likePost,
  addComment,
  getAllPosts,
  deletePost,
  upload, // Exporting upload middleware for potential direct usage
};
