const asyncHandler = require("express-async-handler");
const Story = require("../models/stories.js");
const {User} = require("../models/user.js");
const fs = require("fs");
const path = require("path");
const cloudinary =require("../utils/cloudinary.js");
const { Readable } = require('stream');
const uploadBufferToCloudinary = (buffer, fileType) => {
  return new Promise((resolve, reject) => {
    const resourceType = fileType.includes("video") ? "video" : "image";
    
    const stream = Readable.from(buffer);
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: "SocialMedia/Stories",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.pipe(uploadStream);
  });
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log(`Story deleted from Cloudinary: ${publicId}`, result);
    return result;
  } catch (error) {
    console.error(`Failed to delete story from Cloudinary: ${publicId}`, error);
    return null;
  }
};

const getPublicIdFromUrl = (url) => {
  try {
    if (!url) return null;
    
    const urlParts = url.split("/");
    const folderWithFilename = urlParts.slice(urlParts.indexOf("SocialMedia")).join("/");
    
    return folderWithFilename.split(".")[0];
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};

const uploadStory = asyncHandler(async (req, res) => {
  try {
    upload.single("media")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Please upload an image/video" });
      }
      const cloudinaryUrl = await uploadBufferToCloudinary(req.file.buffer, req.file.mimetype);
      const story = await Story.create({
        user: req.user._id,
        media: cloudinaryUrl,
        mediaType: req.file.mimetype.includes("video") ? "video" : "image"
      });

      if (story) {
        res.status(201).json(story);
      } else {
        res.status(400);
        throw new Error("Invalid story data");
      }
    });
  } catch (error) {
    console.error("Error uploading story:", error);
    res.status(500).json({ message: "Server error", success: false });
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
const getStories = asyncHandler(async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select("following");
    const following = currentUser.following || [];
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const stories = await Story.find({
      user: { $in: following },
      createdAt: { $gte: oneDayAgo }
    }).populate("user", "username profileImage");
    const storyGroups = [];
    const userMap = {};

    for (const story of stories) {
      const userId = story.user._id.toString();
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
    for (const userId in userMap) {
      storyGroups.push(userMap[userId]);
    }
    storyGroups.sort((a, b) => {
      if (a.hasUnseenStories && !b.hasUnseenStories) return -1;
      if (!a.hasUnseenStories && b.hasUnseenStories) return 1;
      return 0;
    });

    res.json(storyGroups);
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


const deleteStory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const story = await Story.findById(id);
  
  if (!story) {
    res.status(404);
    throw new Error("Story not found");
  }
  if (story.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized to delete this story");
  }
  const publicId = getPublicIdFromUrl(story.media);
  
  if (publicId) {
    await deleteFromCloudinary(
      publicId, 
      story.mediaType === "video" ? "video" : "image"
    );
  }
  await Story.deleteOne({ _id: id });
  
  res.status(200).json({ message: "Story deleted successfully" });
});

module.exports = { uploadStory, getStories, markStorySeen, deleteStory };