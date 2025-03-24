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

const deleteMessage = asyncHandler(async (req, res) => {
  try {
    const messageId = req.params.id;
    console.log("message to delete: "+messageId)
    if (!messageId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message ID is required' 
      });
    }
    
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }
    
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only delete your own messages' 
      });
    }
    
    await Message.deleteOne({ _id: messageId });
    
    return res.status(200).json({ 
      success: true, 
      message: 'Message deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to delete message', 
      error: error.message 
    });
  }
});

const deleteBulkMessages = asyncHandler(async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the entire request body
    const { messageIds } = req.body;
    
    if (!messageIds) {
      console.log("No messageIds found in request body");
      return res.status(400).json({ 
        success: false, 
        message: 'MessageIds not found in request body' 
      });
    }
    
    console.log("Message IDs type:", typeof messageIds, Array.isArray(messageIds));
    console.log("Message IDs:", messageIds);
    
    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide valid message IDs as an array' 
      });
    }
    
    // Log user info to verify authentication
    console.log("User ID from auth:", req.user._id);
    
    const messages = await Message.find({ 
      _id: { $in: messageIds },
      senderId: req.user._id
    });
    
    console.log(`Found ${messages.length} messages that match criteria`);
    
    if (messages.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No valid messages found to delete' 
      });
    }
    
    const validIds = messages.map(msg => msg._id);
    console.log("Valid IDs for deletion:", validIds);
    
    const result = await Message.deleteMany({ _id: { $in: validIds } });
    console.log("Delete result:", result);
    
    return res.status(200).json({ 
      success: true, 
      message: `${result.deletedCount} message(s) deleted successfully`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting bulk messages:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to delete messages', 
      error: error.message 
    });
  }
});

const updateMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const messageId = req.params.id;
  
  // Validate content
  if (!content || content.trim() === '') {
      res.status(400);
      throw new Error('Message content cannot be empty');
  }
  
  // Find message
  const message = await Message.findById(messageId);
  
  if (!message) {
      res.status(404);
      throw new Error('Message not found');
  }
  
  // Verify ownership - only message sender can edit
  if (message.senderId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You can only edit your own messages');
  }
  
  // Update message
  message.content = content;
  message.isEdited = true;
  
  const updatedMessage = await message.save();
  
  // Return updated message
  res.status(200).json({
      success: true,
      message: 'Message updated successfully',
      data: updatedMessage
  });
});



module.exports = {
    getMessage,
    sendMessage,
    searchUsers,
    deleteBulkMessages,
    deleteMessage,
    updateMessage
    // Exporting upload middleware for potential direct usage
  };