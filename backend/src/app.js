import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";        // ← ADD करो
import dashboardRoutes from "./routes/dashboardRoutes.js"; // ← ADD करो

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hhhh-fcqaypra6-push123drivedis-projects.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);        // ← ADD करो
app.use("/api/dashboard", dashboardRoutes); // ← ADD करो

export default app;
