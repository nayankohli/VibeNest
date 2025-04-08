const express = require('express');
const router = express.Router();
const { createPost, likePost, addComment, getAllPosts, deletePost, upload,dislikePost,getCommentsOfPost,deleteComment,
fetchFollowing, fetchExplore, getPostsFeed, bookmarkPost, likeComment, unlikeComment, getRepliesOfComment, createReply,
deleteReply,toggleReplyLike
} = require('../controllers/postControllers.js');
const { protect } = require('../middlewares/authMiddleware.js');

router.post('/create',protect, createPost );
router.get('/:id/like', protect, likePost);
router.get('/:id/dislike', protect, dislikePost);
router.post('/comment/:id', protect, addComment);
router.get("/:id/comment/all",protect, getCommentsOfPost);
router.delete('/delete/:id', protect, deletePost);
router.delete('/delete/:commentId/comment/:postId', protect, deleteComment);
router.post('/like/:commentId/comment', protect, likeComment);
router.post('/unlike/:commentId/comment', protect, unlikeComment);
router.get('/all/:id', protect, getAllPosts);
router.get('/all/:id', protect, getAllPosts);
router.get('/following', protect, fetchFollowing);
router.get('/explore', protect, fetchExplore);
router.get('/', protect, getPostsFeed);
router.get('/:id/bookmark', protect, bookmarkPost);
router.get('/:commentId/replies/all', protect, getRepliesOfComment);
router.post('/replies/create', protect, createReply);
router.post('/:replyId/like/reply', protect, toggleReplyLike);
router.post('/:replyId/unlike/reply', protect, toggleReplyLike);
router.delete('/:replyId/delete/reply', protect, deleteReply);

module.exports = router;
