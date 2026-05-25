import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDb } from "./config/db.js";
import { startSchedulers } from "./services/scheduler.js";
import { configureSockets } from "./sockets/index.js";

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  }
});

configureSockets(io);

connectDb()
  .then(() => {
    startSchedulers();
    server.listen(port, () => console.log(`API running on http://localhost:${port}`));
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
