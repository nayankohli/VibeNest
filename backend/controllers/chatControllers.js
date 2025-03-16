const {Conversation} =require("../models/conversation.js");
const { getReceiverSocketId, io } =require("../socket/socket.js");
const {Message}=require("../models/message.js");
const asyncHandler = require('express-async-handler');
const {User}=require("../models/user.js");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB size limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) return cb(null, true);
    cb(new Error('Only .jpeg, .jpg, and .png files are allowed!'));
  },
});

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    // ✅ Check if `userId` is provided
    if (!userId) {
        console.log("❌ UserId param not sent with request");
        return res.status(400).json({ message: "UserId is required" });
    }

    console.log("🔍 Access chat function is working");
    console.log("Requesting user:", req.user._id);
    console.log("Target user:", userId);

    try {
        // ✅ Ensure both `req.user._id` and `userId` are ObjectIds
        const userObjectId = req.user._id.toString();
        const targetUserObjectId = userId.toString();

        // ✅ Fetch existing conversation (using `$all` instead of `$and`)
        let isChat = await Conversation.findOne({
            isGroupChat: false,
            participants: { $all: [userObjectId, targetUserObjectId] }
        })
        .populate("participants", "-password")
        .populate({
            path: "latestMessage",
            populate: { path: "senderId", select: "name profileImage email" }
        });

        console.log("🗂️ Retrieved Chat:", JSON.stringify(isChat, null, 2));

        if (isChat) {
            console.log("✅ Existing chat found");
            return res.status(200).json(isChat);
        } else {
            console.log("❌ No existing chat found, creating a new one...");

            // ✅ Create a new chat
            const chatData = {
                chatName: "senderId",
                isGroupChat: false,
                participants: [userObjectId, targetUserObjectId],
            };

            const createdChat = await Conversation.create(chatData);
            console.log("🆕 Created Chat:", createdChat);

            // ✅ Fetch the full chat with populated fields
            const fullChat = await Conversation.findById(createdChat._id)
                .populate("participants", "-password");

            console.log("🔄 Full Chat Response:", fullChat);
            return res.status(200).json(fullChat);
        }
    } catch (error) {
        console.error("❌ Error in accessChat function:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

  const fetchChats = asyncHandler(async (req, res) => {
    try {
      Conversation.find({ participants: { $elemMatch: { $eq: req.user._id } } })
        .populate("participants", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.senderId",
            select: "username profileImage email",
          });
          res.status(200).send(results);
        });
    } catch (error) {
      res.status(400);
      throw new Error("error while fetching messages"+error.message);
    }
  });

  const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }
  
    var users = JSON.parse(req.body.users);
  
    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
  
    users.push(req.user);
  
    try {
      const groupChat = await Conversation.create({
        chatName: req.body.name,
        participants: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });
  
      const fullGroupChat = await Conversation.findOne({ _id: groupChat._id })
        .populate("participants", "-password")
        .populate("groupAdmin", "-password");
  
      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

  const updateGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    // Fetch existing chat to check profileImage
    const existingChat = await Conversation.findById(chatId);
    if (!existingChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    }

    // If a new profile image is uploaded, update it; otherwise, keep the existing one.
    let profileImage = existingChat.profileImage || "/uploads/default-group.jpg"; // Set default if missing
    if (req.files && req.files.profileImage) {
        profileImage = `/uploads/${req.files.profileImage[0].filename}`;
    }

    // Prepare update fields
    const updateFields = { 
        chatName: chatName || existingChat.chatName, // Keep existing name if not provided
        profileImage: profileImage // Update profile image if provided
    };


    // Update the conversation
    const updatedChat = await Conversation.findByIdAndUpdate(
        chatId,
        updateFields,
        { new: true }
    )
    .populate("participants", "-password")
    .populate("groupAdmin", "-password");

    res.json(updatedChat);
});

  const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  
    // check if the requester is admin
  
    const removed = await Conversation.findByIdAndUpdate(
      chatId,
      {
        $pull: { participants: userId },
      },
      {
        new: true,
      }
    )
      .populate("participants", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
  });

  const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  
    // check if the requester is admin
  
    const added = await Conversation.findByIdAndUpdate(
      chatId,
      {
        $push: { participants: userId },
      },
      {
        new: true,
      }
    )
      .populate("participants", "-password")
      .populate("groupAdmin", "-password");
  
    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }
  });

  module.exports = {
      accessChat,
      fetchChats,
      createGroupChat,
      updateGroup,
      removeFromGroup,
      addToGroup, 
      upload
      // Exporting upload middleware for potential direct usage
    };