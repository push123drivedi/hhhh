import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employeeCode: { type: String, required: true, unique: true },
    phone: String,
    displayName: { type: String, required: true },
    skills: [{ type: String }],
    floorPreference: { type: String, enum: ["GROUND", "FIRST", "ANY"], default: "ANY" },
    currentLocation: {
      floor: { type: String, enum: ["GROUND", "FIRST"], default: "GROUND" },
      x: { type: Number, default: 1 },
      y: { type: Number, default: 1 }
    },
    status: { type: String, enum: ["available", "busy", "offline"], default: "available" },
    workloadScore: { type: Number, default: 0 },
    performance: {
      assigned: { type: Number, default: 0 },
      done: { type: Number, default: 0 },
      notDone: { type: Number, default: 0 },
      totalMinutes: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Staff", staffSchema);
