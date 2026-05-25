import jwt from "jsonwebtoken";
import { setSocketServer } from "../services/socketBus.js";

export function configureSockets(io) {
  setSocketServer(io);

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next();
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next();
    }
  });

  io.on("connection", (socket) => {
    socket.emit("socket:ready", { connected: true });
    socket.on("staff:location", (payload) => {
      socket.broadcast.emit("staff:location", payload);
    });
  });
}
