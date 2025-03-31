const mongoose = require("mongoose");

// Reply Schema
const replySchema = new mongoose.Schema({
  text: { type: String, required: true },
  repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
},
{timestamps: true});

// Comment Schema
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replyCount: { type: Number, default: 0 } 
},
{timestamps: true});

const Reply = mongoose.model("Reply", replySchema);
const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment, Reply };