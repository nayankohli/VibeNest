const express = require('express');
const router = express.Router();
const { registerUser, authUser, updateUserProfile, upload } = require('../controllers/userControllers');
const { protect } = require('../middlewares/authMiddleware.js');

router.post('/register', registerUser);
router.post('/login', authUser);
router.put(
  '/edit-profile',
  protect,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ]),
  updateUserProfile
);

module.exports = router;
