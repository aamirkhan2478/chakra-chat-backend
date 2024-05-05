const express = require("express");
const app = express();
const mainCors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { notFound, errorHandler } = require("./Middleware/errors");

//dotenv
dotenv.config({ path: ".env.local" });
const PORT = process.env.PORT || 4000;

//convert json form
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

//Database Connection
require("./Database/connection");

//Cors
app.use(mainCors({ origin: process.env.CLIENT_URL }));

//Routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/message", require("./routes/messageRoutes"));
app.use(notFound);
app.use(errorHandler);

//Server
const server = http.createServer(app);

//Listening Port
server.listen(PORT, console.log(`Server is running on ${PORT}`));

//Setup socket.io
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

//Create new connection
io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // This is a socket.io event listener that listens for the "setup" event.
  // When it hears the "setup" event, it joins the socket to a room with the
  // name of the user's id.
  // It then emits the "connected" event to the socket.
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // This is a socket.io event listener that listens for a "join chat" event.
  // When it hears that event, it joins the room that is passed in.
  // It then logs a message to the console.
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined chat:" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users is not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
