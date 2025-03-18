const asyncHandler = require("express-async-handler");
const Story = require("../models/stories.js");
const {User} = require("../models/user.js");
const fs = require("fs");
const path = require("path");

const uploadStory = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload an image/video");
  }

  const story = await Story.create({
    user: req.user._id,
    media: `/uploads/stories/${req.file.filename}`,
  });

  if (story) {
    res.status(201).json(story);
  } else {
    res.status(400);
    throw new Error("Invalid story data");
  }
});

const markStorySeen = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  
  if (!story) {
    res.status(404);
    throw new Error("Story not found");
  }

  if (!story.seenBy.includes(req.user._id)) {
    story.seenBy.push(req.user._id);
    await story.save();
  }

  res.json({ success: true });
});

// Add this function to your StoryController file if it doesn't exist
const getStories = asyncHandler(async (req, res) => {
  // Get all stories that are less than 24 hours old
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  // Find all recent stories
  const stories = await Story.find({ 
    createdAt: { $gte: oneDayAgo } 
  }).populate('user', 'name profileImage');
  
  // Group stories by user
  const storyGroups = [];
  const userMap = {};
  
  for (const story of stories) {
    const userId = story.user._id.toString();
    
    // Check if this is unseen by current user
    const isUnseen = !story.seenBy.includes(req.user._id);
    
    if (!userMap[userId]) {
      userMap[userId] = {
        user: story.user,
        stories: [story],
        hasUnseenStories: isUnseen
      };
    } else {
      userMap[userId].stories.push(story);
      if (isUnseen) {
        userMap[userId].hasUnseenStories = true;
      }
    }
  }
  
  // Convert map to array
  for (const userId in userMap) {
    storyGroups.push(userMap[userId]);
  }
  
  // Sort groups - unseen first
  storyGroups.sort((a, b) => {
    if (a.hasUnseenStories && !b.hasUnseenStories) return -1;
    if (!a.hasUnseenStories && b.hasUnseenStories) return 1;
    return 0;
  });
  
  res.json(storyGroups);
});

const deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  
  if (!story) {
    res.status(404);
    throw new Error("Story not found");
  }

  // Check if user is authorized to delete
  if (story.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // Delete the media file
  if (story.media) {
    const filePath = path.join(__dirname, '..', story.media);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await story.deleteOne();
  res.json({ message: "Story removed" });
});

module.exports = { uploadStory, getStories, markStorySeen, deleteStory };