import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    https://hhhh-fcqaypra6-push123drivedis-projects.vercel.app
  ],
  credentials: true
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

export default app;
