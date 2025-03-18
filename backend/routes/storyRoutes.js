const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { uploadStory, getStories, markStorySeen, deleteStory } = require("../controllers/storyController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/stories'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB size limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|mp4|mov/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) return cb(null, true);
    cb(new Error('Only .jpeg, .jpg, .png, .mp4, and .mov files are allowed!'));
  },
});

router.post("/", protect, upload.single('media'), uploadStory);
router.get("/", protect, getStories);
router.put("/:id/seen", protect, markStorySeen);
router.delete("/:id", protect, deleteStory);

module.exports = router;
