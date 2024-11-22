const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path'); 
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static('../frontend/build')); 

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', (msg) => {
        io.emit('message', msg);
    });

    socket.on('disconnect', () => console.log('Client disconnected'));
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

//***************************ROUTES*************************

const userRoutes=require("./routes/userRoutes.js");
app.use("/api/users",userRoutes);

//Middlewares

const { notFound,errorHandler } = require('./middlewares/errorMiddleware.js');
app.use(notFound);
app.use(errorHandler);


server.listen(5000, () => console.log(  'Server running on port 5000'));
