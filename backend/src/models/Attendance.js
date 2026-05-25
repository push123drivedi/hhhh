import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ["present", "absent", "leave", "late"], default: "present" },
    checkIn: Date,
    checkOut: Date,
    remarks: String
  },
  { timestamps: true }
);

attendanceSchema.index({ staff: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
