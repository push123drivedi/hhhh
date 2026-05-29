import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { connectDb } from "./config/db.js";
import { startSchedulers } from "./services/scheduler.js";

const port = process.env.PORT || 10000;

// ✅ Create HTTP Server
const server = http.createServer(app);

// ✅ Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://hhhh-phi-neon.vercel.app",
      "https://hhhh-fcqaypra6-push123drivedis-projects.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket", "polling"]
});

// ✅ Socket.io Connection Handler
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);
  console.log("📊 Total connected users:", io.engine.clientsCount);

  // User disconnect
  socket.on("disconnect", (reason) => {
    console.log("🔴 User disconnected:", socket.id, `(${reason})`);
    console.log("📊 Total connected users:", io.engine.clientsCount);
  });

  // Handle socket errors
  socket.on("error", (error) => {
    console.error("🔴 Socket error for", socket.id, ":", error);
  });

  // Custom events (optional - for future use)
  socket.on("message", (data) => {
    console.log("💬 Message from", socket.id, ":", data);
  });
});

// ✅ Export io globally so routes can access it
// Routes will use: const io = req.app.locals.io;
app.locals.io = io;

// ✅ Start Server Function
async function startServer() {
  try {
    console.log("🔄 Connecting to MongoDB...");

    // Connect to MongoDB
    await connectDb();
    console.log("✅ MongoDB Connected Successfully");

    // Start schedulers
    console.log("⏰ Starting schedulers...");
    startSchedulers();
    console.log("✅ Schedulers started");

    // Listen on port
    server.listen(port, "0.0.0.0", () => {
      console.log("");
      console.log("╔════════════════════════════════════════════╗");
      console.log("║    🚀 SMART STAFF DUTY SERVER STARTED      ║");
      console.log("╠════════════════════════════════════════════╣");
      console.log(`║ 🌐 HTTP Server: http://localhost:${port}`);
      console.log(`║ 🔌 Socket.io:   ws://localhost:${port}`);
      console.log("║ 📊 API:        /api/*                      ║");
      console.log("║ 🏥 Health:     /api/health                ║");
      console.log("╚════════════════════════════════════════════╝");
      console.log("");
    });

  } catch (error) {
    console.error("");
    console.error("╔════════════════════════════════════════════╗");
    console.error("║         ❌ SERVER STARTUP ERROR            ║");
    console.error("╠════════════════════════════════════════════╣");
    console.error("║", error.message.padEnd(40), "║");
    console.error("╚════════════════════════════════════════════╝");
    console.error("");
    console.error(error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("⚠️ SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});