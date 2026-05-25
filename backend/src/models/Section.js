import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    sectionName: { type: String, required: true },
    sectionCode: { type: String, required: true, unique: true },
    floor: { type: mongoose.Schema.Types.ObjectId, ref: "Floor", required: true },
    priority: { type: Number, default: 3 },
    coordinates: {
      x: { type: Number, required: true },
      y: { type: Number, required: true }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Section", sectionSchema);
