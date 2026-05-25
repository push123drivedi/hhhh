import mongoose from "mongoose";

const floorSchema = new mongoose.Schema(
  {
    floorName: { type: String, required: true },
    floorCode: { type: String, required: true, unique: true },
    level: { type: Number, required: true },
    description: String
  },
  { timestamps: true }
);

export default mongoose.model("Floor", floorSchema);
