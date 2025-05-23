const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const {User}=require("./models/user.js");
const path = require('path');
dotenv.config();
const bcrypt=require("bcryptjs");
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use(
  cors({
    origin: ["http://localhost:3000", "https://vibenest-lm4w.onrender.com","https://vibe-nest-dyyi.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, 
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === "production") {
  app.get("/", (req, res) => {
    res.json({ message: "VibeNest API is running. Frontend is served from a separate deployment." });
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is healthy", timestamp: new Date().toISOString() });
});

//ROUTES************************

const userRoutes=require("./routes/userRoutes.js");
app.use("/api/users",userRoutes);

const postRoutes=require("./routes/postRoutes.js");
app.use("/api/posts",postRoutes);

const messageRoutes = require("./routes/messageRoutes.js");
app.use("/api/message", messageRoutes);

const storyRoutes = require("./routes/storyRoutes.js");
app.use("/api/stories", storyRoutes);

const chatRoutes = require("./routes/chatRoutes.js");
app.use("/api/chat", chatRoutes);
//Middlewares

const { notFound,errorHandler } = require('./middlewares/errorMiddleware.js');
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ['https://vibe-nest-dyyi.vercel.app', 'http://localhost:3000'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  const connectedUsers = new Map();

  socket.on("setup", (userData) => {
    if (userData && userData._id) {
      connectedUsers.set(userData._id, socket.id);
      console.log(`User ${userData._id} connected with socket ID ${socket.id}`);
    }
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.participants) return console.log("chat.users not defined");

    chat.participants.forEach((user) => {
      if (user._id == newMessageRecieved.senderId._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("follow request", (followRequestData) => {
    const { sender, recipient } = followRequestData;

    console.log(`Follow request from ${sender.name || sender._id} to ${recipient.name || recipient._id}`);
    const notification = {
      id: Date.now(),
      content:` ${sender.name || sender.username || 'Someone'} requested to follow you`,
      type: 'follow_request',
      data: {
        senderId: sender._id,
        senderName: sender.name || sender.username || 'Someone',
        senderPic: sender.profileImage || null,
        timestamp: Date.now()
      },
      timestamp: Date.now(),
      read: false
    };
    const recipientSocketId = connectedUsers.get(recipient._id);
    if (recipientSocketId) {
      console.log(`Recipient ${recipient._id} is online with socket ID ${recipientSocketId}`);
      io.to(recipientSocketId).emit("follow request received", notification);
    } else {
      console.log(`Recipient ${recipient._id} is not online`);
    }
    socket.broadcast.to(recipient._id).emit("follow request received", notification);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});