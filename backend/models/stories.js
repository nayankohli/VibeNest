const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  media: { type: String, required: true }, // Image/Video URL
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // Auto-delete after 24 hours
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who viewed the story
});

module.exports = mongoose.model("Story", StorySchema);
