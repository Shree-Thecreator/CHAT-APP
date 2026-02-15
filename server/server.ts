import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "https://chat-app-jghy.vercel.app",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", (data: any) => {
    io.emit("receive_message", { ...data, sender: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Socket.IO server is running 🚀");
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
