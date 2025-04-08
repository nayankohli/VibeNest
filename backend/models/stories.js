const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  media: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now, expires: 86400 }, 
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
});

module.exports = mongoose.model("Story", StorySchema);
