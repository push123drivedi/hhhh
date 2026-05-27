import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: [
  "http://localhost:5173",
"https://hhhh-phi-neon.vercel.app"
],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;
