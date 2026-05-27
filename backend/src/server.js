import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { connectDb } from "./config/db.js";
import { startSchedulers } from "./services/scheduler.js";

const port = process.env.PORT || 10000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://hhhh-fcqaypra6-push123drivedis-projects.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

async function startServer() {
  try {
    console.log("Connecting MongoDB...");

    await connectDb();

    console.log("MongoDB Connected");

    startSchedulers();

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (error) {
    console.error("SERVER ERROR:");
    console.error(error);
  }
}

startServer();
