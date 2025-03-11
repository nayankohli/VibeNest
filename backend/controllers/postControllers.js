const { Post } = require('../models/posts.js');
const {User}=require("../models/user.js");
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');
const cloudinary =require("../utils/cloudinary.js");
const Comment = require("../models/comment.js");
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

    try {
      const mediaPaths = req.files.map((file) => `/uploads/${file.filename}`);
      if (mediaPaths.length > 5) {
        return res.status(400).json({ message: 'Exceeds the limit of 5 media files per post' });
      }

      // Create a new post
      const post = await Post.create({
        caption,
        media: mediaPaths,
        postedBy: req.user._id,
        comments: [],
        likes: [],
      });

      const user = await User.findById(req.user._id);
      if (user) {
        user.posts.unshift(post._id);
        await user.save();
        console.log('Post added to user:', user);
      }

      res.status(201).json(post);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }),
];


// Like or unlike a post
const likePost = asyncHandler(async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.user._id;
    const postId = req.params.id; 
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found', success: false });

    // like logic started
    await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
    await post.save();

    // implement socket io for real time notification
    const user = await User.findById(likeKrneWalaUserKiId).select('username profileImage');
     
    const postOwnerId = post.postedBy.toString();
    if(postOwnerId !== likeKrneWalaUserKiId){
        // emit a notification event
        const notification = {
            type:'like',
            userId:likeKrneWalaUserKiId,
            userDetails:user,
            postId,
            message:'Your post was liked'
        }
        const postOwnerSocketId = getReceiverSocketId(postOwnerId);
        io.to(postOwnerSocketId).emit('notification', notification);
    }

    return res.status(200).json({message:'Post liked', success:true});
} catch (error) {

}
});

 const dislikePost = async (req, res) => {
  try {
      const likeKrneWalaUserKiId = req.user._id;
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found', success: false });

      // like logic started
      await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
      await post.save();

      // implement socket io for real time notification
      const user = await User.findById(likeKrneWalaUserKiId).select('username profileImage');
      const postOwnerId = post.postedBy.toString();
      if(postOwnerId !== likeKrneWalaUserKiId){
          // emit a notification event
          const notification = {
              type:'dislike',
              userId:likeKrneWalaUserKiId,
              userDetails:user,
              postId,
              message:'Your post was liked'
          }
          const postOwnerSocketId = getReceiverSocketId(postOwnerId);
          io.to(postOwnerSocketId).emit('notification', notification);
      }



      return res.status(200).json({message:'Post disliked', success:true});
  } catch (error) {

  }
}

// Add a comment to a post
const addComment = async (req,res) =>{
    try {
        const postId = req.params.id;
        const commentKrneWalaUserKiId = req.user._id;

        const {text} = req.body;

        const post = await Post.findById(postId);

        if(!text) return res.status(400).json({message:'text is required', success:false});

        const comment = await Comment.create({
            text,
            commentedBy:commentKrneWalaUserKiId,
            post:postId
        })

        await comment.populate({
            path:'commentedBy',
            select:"username profileImage jobProfile"
        });
        
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message:'Comment Added',
            comment,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
};

 const getCommentsOfPost = async (req,res) => {
  try {
      const postId = req.params.id;

      const comments = await Comment.find({post:postId}).populate('commentedBy', 'username profileImage jobProfile');

      if(!comments) return res.status(404).json({message:'No comments found for this post', success:false});

      return res.status(200).json({success:true,comments});

  } catch (error) {
      console.log(error);
  }
}

// Fetch all posts
const getAllPosts = asyncHandler(async (req, res) => {
  const userId=req.params.id;
  console.log('Get All Posts Endpoint Hit');
  try {
    const posts = await Post.find({ postedBy: userId })
    .sort({ createdAt: -1 })
      .populate('postedBy', 'username profileImage jobProfile')
      .populate({
        path: 'comments',
        populate: {
            path: 'commentedBy',
            select: 'username profileImage jobProfile'
        }
    });

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
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      if (post.postedBy.toString() === req.user._id.toString() || req.user.isAdmin) {
        const user = await User.findById(post.postedBy);
        if (user) {
          user.posts = user.posts.filter((postId) => postId.toString() !== req.params.id);
          await user.save();
        }
        await Post.deleteOne({ _id: req.params.id });
        
        res.json({ message: 'Post deleted successfully' });
      } else {
        res.status(401);
        throw new Error('You are not authorized to delete this post');
      }
    } else {
      res.status(404);
      throw new Error('Post not found');
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    console.log("Comment to be deleted: ", comment);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Ensure only the comment owner or an admin can delete the comment
    if (comment.commentedBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'You are not authorized to delete this comment' });
    }

    // Fetch the post using the correct model
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Remove the comment ID from the post's comments array
    post.comments = post.comments.filter((id) => id.toString() !== req.params.commentId);
    await post.save(); // Save the post after removing the comment ID

    // Delete the comment from the Comment collection
    await Comment.deleteOne({ _id: req.params.commentId });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

  

// Export all controllers
module.exports = {
  createPost,
  likePost,
  dislikePost,
  addComment,
  getAllPosts,
  deletePost,
  upload,
  getCommentsOfPost,
  deleteComment // Exporting upload middleware for potential direct usage
};
