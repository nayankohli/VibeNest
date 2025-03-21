const express = require('express');
const router = express.Router();
const { createPost, likePost, addComment, getAllPosts, deletePost, upload,dislikePost,getCommentsOfPost,deleteComment,
fetchFollowing, fetchExplore, getPostsFeed, bookmarkPost
} = require('../controllers/postControllers.js');
const { protect } = require('../middlewares/authMiddleware.js');

// Route for creating a post (uploading up to 5 media files)
router.post('/create',protect, createPost ); // Accepts up to 5 media files

router.get('/:id/like', protect, likePost);

router.get('/:id/dislike', protect, dislikePost);

router.post('/comment/:id', protect, addComment);
router.get("/:id/comment/all",protect, getCommentsOfPost);
router.delete('/delete/:id', protect, deletePost);
router.delete('/delete/:commentId/comment/:postId', protect, deleteComment);
router.get('/all/:id', protect, getAllPosts);
router.get('/following', protect, fetchFollowing);
router.get('/explore', protect, fetchExplore);
router.get('/', protect, getPostsFeed);
router.get('/:id/bookmark', protect, bookmarkPost);

module.exports = router;
