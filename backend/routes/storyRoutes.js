const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { uploadStory, getStories, markStorySeen, deleteStory } = require("../controllers/storyController");

router.post("/", protect, uploadStory);
router.get("/", protect, getStories);
router.put("/:id/seen", protect, markStorySeen);
router.delete("/:id", protect, deleteStory);

module.exports = router;
