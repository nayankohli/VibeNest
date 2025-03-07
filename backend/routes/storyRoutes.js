const express = require("express");
const router = express.Router();
const Story = require("../models/stories.js");
const { protect } = require("../middlewares/authMiddleware");

// Upload a new story
router.post("/upload", protect, async (req, res) => {
  try {
    console.log("User ID:", req.user?._id);
    console.log("Media:", req.body.media);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (!req.body.media) {
      return res.status(400).json({ message: "Media file is required" });
    }

    const story = new Story({
      user: req.user._id,
      media: req.body.media,
    });

    await story.save();
    res.status(201).json(story);
  } catch (error) {
    console.error("Error saving story:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Get all stories of users (excluding expired)
router.get("/", protect, async (req, res) => {
  try {
    const stories = await Story.find().populate("user", "username profileImage");
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

// Mark story as seen
router.post("/:id/seen", protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ error: "Story not found" });

    if (!story.seenBy.includes(req.user._id)) {
      story.seenBy.push(req.user._id);
      await story.save();
    }
    res.json({ success: true, story });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark story as seen" });
  }
});

module.exports = router;
