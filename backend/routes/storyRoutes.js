const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { uploadStory, getStories, markStorySeen, deleteStory } = require("../controllers/storyController");
const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png/;
  const videoTypes = /mp4|mov/;
  
  if (imageTypes.test(file.mimetype)) {
    req.fileTypeLimit = 2 * 1024 * 1024; 
    return cb(null, true);
  } else if (videoTypes.test(file.mimetype)) {
    req.fileTypeLimit = 50 * 1024 * 1024;
    return cb(null, true);
  }
  
  cb(new Error("Only .jpeg, .jpg, .png, .mp4, and .mov files are allowed!"));
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter
});

router.post("/", protect, upload.single('media'), uploadStory);
router.get("/", protect, getStories);
router.put("/:id/seen", protect, markStorySeen);
router.delete("/:id", protect, deleteStory);

module.exports = router;
