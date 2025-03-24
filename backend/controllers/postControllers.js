const { Post } = require('../models/posts.js');
const {User}=require("../models/user.js");
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');
const cloudinary =require("../utils/cloudinary.js");
const {Comment ,Reply}= require("../models/comment.js");
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

      // Populate the postedBy field with username and profile image
      await post.populate({
        path: 'postedBy',
        select: 'username profileImage jobProfile _id'
      });

      const user = await User.findById(req.user._id);
      if (user) {
        user.posts.unshift(post._id);
        await user.save();
        console.log('Post added to user:', user);
      }

      res.status(201).json({
        success: true,
        post
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Server error', success: false });
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

    // Add like to post
    await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });

    // Implement socket.io for real-time notification
    const user = await User.findById(likeKrneWalaUserKiId).select('username profileImage');
    const postOwnerId = post.postedBy.toString();

    // if (postOwnerId !== likeKrneWalaUserKiId) {
    //     // Emit a notification event
    //     const notification = {
    //         type: 'like',
    //         userId: likeKrneWalaUserKiId,
    //         userDetails: user,
    //         postId,
    //         message: 'Your post was liked'
    //     };
    //     const postOwnerSocketId = getReceiverSocketId(postOwnerId);
    //     if (postOwnerSocketId) io.to(postOwnerSocketId).emit('notification', notification);
    // }

    return res.status(200).json({ message: 'Post liked', success: true });

  } catch (error) {
    console.error("Error in likePost:", error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
});

const dislikePost = asyncHandler(async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.user._id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found', success: false });

    // Remove like from post
    await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });

    // Implement socket.io for real-time notification
    const user = await User.findById(likeKrneWalaUserKiId).select('username profileImage');
    const postOwnerId = post.postedBy.toString();

    // if (postOwnerId !== likeKrneWalaUserKiId) {
    //     // Emit a notification event
    //     const notification = {
    //         type: 'dislike',
    //         userId: likeKrneWalaUserKiId,
    //         userDetails: user,
    //         postId,
    //         message: 'Your post was disliked'
    //     };
    //     const postOwnerSocketId = getReceiverSocketId(postOwnerId);
    //     if (postOwnerSocketId) io.to(postOwnerSocketId).emit('notification', notification);
    // }

    return res.status(200).json({ message: 'Post disliked', success: true });

  } catch (error) {
    console.error("Error in dislikePost:", error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
});
const addComment = async (req, res) => {
  try {
    const { text, postId } = req.body;
    const userId = req.user._id; // Assuming you have user authentication middleware
    
    const newComment = await Comment.create({
      text,
      commentedBy: userId,
      post: postId
    });
    
    const populatedComment = await Comment.findById(newComment._id)
      .populate({
        path: "commentedBy",
        select: "username profileImage jobProfile"
      });
    
    res.status(201).json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


 const getCommentsOfPost = async (req,res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate({
        path: "commentedBy",
        select: "username profileImage jobProfile"
      })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      comments
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
const getAllPosts = asyncHandler(async (req, res) => {
  const userId=req.params.id;
  console.log('Get All Posts Endpoint Hit');
  try {
    const posts = await Post.find({ postedBy: userId })
    .sort({ createdAt: -1 })
      .populate('postedBy', 'username profileImage jobProfile bookmarks')
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
const deletePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found', success: false });
    }

    if (post.postedBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to delete this post', success: false });
    }
    const user = await User.findById(post.postedBy);
    if (user) {
      user.posts = user.posts.filter((postId) => postId.toString() !== req.params.id);
      await user.save();
    }
    await User.updateMany(
      { bookmarks: req.params.id },
      { $pull: { bookmarks: req.params.id } }
    );
    await Post.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: 'Post deleted successfully', success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
});

const likeComment=asyncHandler(async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    if (comment.likes.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: "Comment already liked" });
    }
    comment.likes.push(req.user.id);
    await comment.save();
    
    res.json({ success: true, message: "Comment liked successfully" });
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

const unlikeComment=asyncHandler(async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    if (!comment.likes.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: "Comment not liked yet" });
    }
    comment.likes = comment.likes.filter(
      like => like.toString() !== req.user.id.toString()
    );
    await comment.save();
    
    res.json({ success: true, message: "Comment unliked successfully" });
  } catch (error) {
    console.error("Error unliking comment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    if (
      comment.commentedBy.toString() !== req.user.id.toString() &&
      post.postedBy.toString() !== req.user.id.toString()
    ) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const replies = await Comment.find({ parentId: req.params.commentId });
    const deleteCount = 1 + replies.length
    await Comment.findByIdAndDelete(req.params.commentId);
    if (replies.length > 0) {
      await Comment.deleteMany({ parentId: req.params.commentId });
    }
    await Post.findByIdAndUpdate(req.params.postId, {
      $inc: { commentCount: -deleteCount }
    });
    
    res.json({ 
      success: true, 
      message: "Comment and associated replies deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

const fetchFollowing = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const user = await User.findById(req.user._id);
    const following = user.following || [];
    if (following.length === 0) {
      return res.json({ posts: [] });
    }

    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    const posts = await Post.find({
      postedBy: { $in: following },
      createdAt: { $gte: fortyEightHoursAgo }  
    })
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit)
        .populate([
          {
            path: 'postedBy',
            select: 'username profileImage privacy bookmarks'
          },
          {
            path: 'comments',
            populate: {
              path: 'commentedBy',
              select: 'username profileImage'
            }
          }
        ])
    
    res.json({ posts });
  } catch (error) {
    console.error("Following posts error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


const fetchExplore = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const user = await User.findById(req.user._id);
    const following = user.following || [];
    
    const excludeUsers = [...following];
    if (!excludeUsers.includes(req.user._id.toString())) {
      excludeUsers.push(req.user._id);
    }
    
    const publicUsers = await User.find({ 
      _id: { $nin: excludeUsers }, 
      privacy: 'public'
    }).select('_id'); 

    const publicUserIds = publicUsers.map(user => user._id);

    const posts = await Post.find({
      postedBy: { $in: publicUserIds } 
    })
      .sort({ createdAt: -1 })        
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: 'postedBy',
          select: 'username profileImage privacy bookmarks'
        },
        {
          path: 'comments',
          populate: {
            path: 'commentedBy',
            select: 'username profileImage'
          }
        }
      ])

    console.log("Fetched posts count:", posts.length);
    
    res.json({ posts });
  } catch (error) {
    console.error("Explore posts error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const getPostsFeed = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const currentUser = await User.findById(req.user._id);
    const following = currentUser.following || [];

    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);
    
    const publicUsers = await User.find({ 
      _id: { $nin: [req.user._id, ...following] }, 
      privacy: 'public' 
    }).select('_id');

    const publicUserIds = publicUsers.map(user => user._id);
    const posts = await Post.find({
      $or: [
        { 
          postedBy: { $in: following },
          createdAt: { $gte: fortyEightHoursAgo }
        },
        { 
          postedBy: { $in: publicUserIds }
        }
      ]
    })
      .sort({ createdAt: -1 })        
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: 'postedBy',
          select: 'username profileImage privacy bookmarks'
        },
        {
          path: 'comments',
          populate: {
            path: 'commentedBy',
            select: 'username profileImage'
          }
        }
      ]);

    res.json({ posts });
  } catch (error) {
    console.error("Mixed feed error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const bookmarkPost = asyncHandler(async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isBookmarked = user.bookmarks.includes(postId);
    
    if (isBookmarked) {
      await User.findByIdAndUpdate(userId, {
        $pull: { bookmarks: postId }
      });
      
      res.status(200).json({
        success: true,
        message: 'Post removed from bookmarks',
        isBookmarked: false
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { bookmarks: postId }
      });
      
      res.status(200).json({
        success: true,
        message: 'Post added to bookmarks',
        isBookmarked: true
      });
    }
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while bookmarking post',
      error: error.message
    });
  }
});

const getRepliesOfComment = async (req, res) => {
  try {
    const replies = await Reply.find({ comment: req.params.commentId })
      .populate({
        path: "repliedBy",
        select: "username profileImage jobProfile"
      })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      replies
    });
  } catch (error) {
    console.error("Error fetching replies:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const createReply = async (req, res) => {
  try {
    const { text, commentId } = req.body;
    
    if (!commentId) {
      return res.status(400).json({ 
        success: false, 
        message: "Comment ID is required" 
      });
    }
    
    const userId = req.user._id; // Assuming you have user authentication middleware
    
    // Verify the comment exists first
    const commentExists = await Comment.findById(commentId);
    if (!commentExists) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }
    
    const newReply = await Reply.create({
      text,
      repliedBy: userId,
      comment: commentId  // This field must match your Reply schema definition
    });
    
    // Increment the reply count on the parent comment
    await Comment.findByIdAndUpdate(commentId, { $inc: { replyCount: 1 } });
    
    const populatedReply = await Reply.findById(newReply._id)
      .populate({
        path: "repliedBy",
        select: "username profileImage jobProfile"
      });
    
    res.status(201).json({
      success: true,
      reply: populatedReply
    });
  } catch (error) {
    console.error("Error creating reply:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};

const toggleReplyLike = async (req, res) => {
  try {
    const { replyId } = req.params;
    const userId = req.user._id;

    // Check if reply exists
    const reply = await Reply.findById(replyId);
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found"
      });
    }

    // Check if user has already liked the reply
    const isLiked = reply.likes.includes(userId);

    // Toggle like status
    if (isLiked) {
      // Unlike: Remove user ID from likes array
      await Reply.findByIdAndUpdate(replyId, {
        $pull: { likes: userId }
      });
      
      res.status(200).json({
        success: true,
        message: "Reply unliked successfully",
        liked: false
      });
    } else {
      // Like: Add user ID to likes array
      await Reply.findByIdAndUpdate(replyId, {
        $addToSet: { likes: userId }
      });
      
      res.status(200).json({
        success: true,
        message: "Reply liked successfully",
        liked: true
      });
    }
  } catch (error) {
    console.error("Error toggling reply like:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// Delete a reply
const deleteReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const userId = req.user._id;

    // Find the reply
    const reply = await Reply.findById(replyId);
    
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found"
      });
    }

    // Check if user is authorized to delete (either the reply creator or an admin)
    if (reply.repliedBy.toString() !== userId.toString() ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this reply"
      });
    }
    const commentId = reply.comment;

    await Reply.findByIdAndDelete(replyId);

    await Comment.findByIdAndUpdate(commentId, { $inc: { replyCount: -1 } });

    res.status(200).json({
      success: true,
      message: "Reply deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting reply:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

module.exports = {
  createPost,
  likePost,
  dislikePost,
  addComment,
  getAllPosts,
  deletePost,
  upload,
  getCommentsOfPost,
  deleteComment,
  fetchFollowing,
  fetchExplore,
  getPostsFeed,
  bookmarkPost,
  likeComment,
  unlikeComment,
  getRepliesOfComment,
  createReply,
  deleteReply,
  toggleReplyLike// Exporting upload middleware for potential direct usage
};
