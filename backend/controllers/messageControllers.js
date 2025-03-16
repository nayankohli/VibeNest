const {Conversation} =require("../models/conversation.js");
const { getReceiverSocketId, io } =require("../socket/socket.js");
const {Message}=require("../models/message.js");
const asyncHandler = require('express-async-handler');
const {User}=require("../models/user.js");
// for chatting
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    let message = await Message.create({
      senderId: req.user._id,
      content,
      chat: chatId,
    });

    message = await message.populate([
      { path: "senderId", select: "username profileImage" },
      { path: "chat", populate: { path: "participants", select: "name profileImage email" } }
    ]);

    message = await User.populate(message, {
      path: "chat.participants",
      select: "name profileImage email",
    });

    console.log("Updating conversation with chatId:", chatId);
    
    const updatedConversation = await Conversation.findByIdAndUpdate(
      chatId,
      { $set: { latestMessage: message._id, updatedAt: new Date() } },
      { new: true }
    );

    console.log("Updated Conversation:", updatedConversation);

    res.status(200).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: error.message });
  }
});



const getMessage = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.id })
    .populate([
      { path: "senderId", select: "username profileImage" },
      { path: "chat", populate: { path: "participants", select: "name profileImage email" } }
    ]);
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const searchUsers = asyncHandler(async (req, res) => {
    try {
        // Get the search query from the request
        const query = req.query.query;
        console.log(query);
        // Validate the query
        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Fetch the logged-in user's followers
        const user = await User.findById(req.user._id).populate("following");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Search within followers
        const filteredFollowing = await User.find({
            _id: { $in: user.following}, // Only users who are followers
            username: { $regex: query, $options: "i" } // Case-insensitive search
        }).select("username profileImage email name");
        console.log(filteredFollowing);
        res.status(200).json({ 
            success: true, 
            users: filteredFollowing, // Include conversation date
        });
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});



module.exports = {
    getMessage,
    sendMessage,
    searchUsers,
    // Exporting upload middleware for potential direct usage
  };