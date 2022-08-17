const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data.js");
const connectDB = require("./config/db.js");
const app = express();
const colors = require("colors");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");
dotenv.config();
connectDB();
app.use(express.json());
//
//
//
const PORT = process.env.PORT || 4000;
const server = app.listen(
  PORT,
  console.log(`Server started on port ${PORT}`.yellow.bold)
);

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Deployment

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}
// Deployment
app.use(notFound);
app.use(errorHandler);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessage) => {
    var chat = newMessage.chat;

    if (!chat.users) return console.log("chat.users does not exist");

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;

      socket.in(user._id).emit("message received", newMessage);
    });
  });

  // socket.off("setup", ()=> {
  //   console.log("USER DISCONNECTED");
  //   socket.leave(userData._id);
  // })

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
