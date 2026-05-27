import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { connectDb } from "./config/db.js";
import { startSchedulers } from "./services/scheduler.js";
// import { configureSockets } from "./sockets/index.js";

const port = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://hhhh-fcqypra6-push123drivedis-projects.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// configureSockets(io);

connectDb()
  .then(() => {
    startSchedulers();

    server.listen(port, () => {
      console.log(`API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
