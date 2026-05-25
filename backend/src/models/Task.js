import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    recommendedWorker: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Done"],
      default: "Pending"
    },
    adminDecision: { type: String, enum: ["Pending", "Done", "Not Done"], default: "Pending" },
    priority: { type: Number, default: 3 },
    estimatedMinutes: { type: Number, default: 20 },
    actualMinutes: { type: Number, default: 0 },
    aiScore: { type: Number, default: 0 },
    aiReason: String,
    cleaningSteps: [
      {
        name: { type: String, enum: ["Sweeping", "Mopping", "Dusting"], required: true },
        done: { type: Boolean, default: false },
        completedAt: Date
      }
    ],
    startedAt: Date,
    completedAt: Date,
    dueAt: Date,
    notes: String,
    history: [
      {
        action: String,
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        at: { type: Date, default: Date.now },
        note: String
      }
    ]
  },
  { timestamps: true }
);

taskSchema.index({ date: 1, status: 1, adminDecision: 1, priority: -1 });
taskSchema.index({ date: 1, room: 1, adminDecision: 1 });

export default mongoose.model("Task", taskSchema);
