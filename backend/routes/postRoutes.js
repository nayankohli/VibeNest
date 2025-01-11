const express = require('express');
const router = express.Router();
const { createPost, likePost, addComment, getAllPosts, deletePost, upload} = require('../controllers/postControllers.js');
const { protect } = require('../middlewares/authMiddleware.js');

// Route for creating a post (uploading up to 5 media files)
router.post('/create',protect, upload.array('media', 5), createPost ); // Accepts up to 5 media files

router.post('/like/:id', protect, likePost);

router.post('/comment/:id', protect, addComment);

router.delete('/delete/:id', protect, deletePost);

router.get('/all', protect, getAllPosts);

module.exports = router;
