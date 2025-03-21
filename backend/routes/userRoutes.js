const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  updateUserProfile,
  upload,
  searchUsers,
  fetchProfile,
  allUsers,
  followOrUnfollow,
  getFollowers,
  getFollowing,
  getSuggestedUsers,
  updateUserPrivacy,
  getSavedPosts
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware.js");

router.post("/register", registerUser);
router.post("/login", authUser);
router.put(
  "/edit-profile",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateUserProfile
);
router.get("/search", protect, searchUsers);
router.get("/profile/:id", protect, fetchProfile);
router.get("/", protect, allUsers);
router.post("/followUnfollow/:id", protect, followOrUnfollow);
router.get("/followers/:id", protect, getFollowers);
router.get("/following/:id", protect, getFollowing);
router.get("/suggested", protect, getSuggestedUsers);
router.put("/privacy", protect, updateUserPrivacy);
router.get('/saved-posts', protect, getSavedPosts);
module.exports = router;
