import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { notFound, errorHandler } from "./Middleware/errors.js";
import { Server } from "socket.io";
import connection from "./Database/connection.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

//dotenv
dotenv.config({ path: ".env.local" });

// Initialize express
const app = express();

// Initialize socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//convert json form
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

//Cors
app.use(
  cors({
    origin: "*",
  })
);

//Database Connection
connection();

// Starting endpoint
app.get("/", (_req, res) => {
  res.send("<h1 style='color:green;'>Hurrah! Server is running.</h1>");
});

//Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);

//Create new connection
io.on("connection", (socket) => {
  console.log(`Connected to socket.io ${socket.id}`);

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

//Listening Port
const PORT = process.env.PORT || 4000;
server.listen(
  PORT,
  console.log(`Server is running on http://localhost:${PORT}`)
);
