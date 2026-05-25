import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomName: { type: String, required: true },
    floor: { type: mongoose.Schema.Types.ObjectId, ref: "Floor", required: true },
    floorCode: { type: String, enum: ["GROUND", "FIRST"], required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    sectionCode: { type: String, required: true },
    roomType: { type: String, required: true },
    priority: { type: Number, min: 1, max: 6, default: 3 },
    cleaningTime: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      estimated: { type: Number, required: true }
    },
    assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    cleaningStatus: {
      type: String,
      enum: ["Pending", "In Progress", "Done"],
      default: "Pending"
    },
    cleaningSteps: [
      {
        name: { type: String, enum: ["Sweeping", "Mopping", "Dusting"], required: true },
        done: { type: Boolean, default: false },
        completedAt: Date
      }
    ],
    completedAt: Date,
    coordinates: {
      x: { type: Number, required: true },
      y: { type: Number, required: true }
    },
    notes: String
  },
  { timestamps: true }
);

roomSchema.index({ floorCode: 1, sectionCode: 1, priority: -1, cleaningStatus: 1 });
roomSchema.index({ roomName: "text", roomType: "text", sectionCode: "text" });

export default mongoose.model("Room", roomSchema);
