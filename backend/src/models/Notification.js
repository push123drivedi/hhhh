import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["info", "success", "warning", "urgent"], default: "info" },
    audience: { type: String, enum: ["admin", "supervisor", "staff", "all"], default: "all" },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
