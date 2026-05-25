import mongoose from "mongoose";

const dailyReportSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true },
    totalRooms: { type: Number, default: 0 },
    cleanedRooms: { type: Number, default: 0 },
    pendingRooms: { type: Number, default: 0 },
    inProgressRooms: { type: Number, default: 0 },
    fastestWorker: String,
    averageCleaningTime: { type: Number, default: 0 },
    workerSummary: [
      {
        workerName: String,
        assigned: Number,
        done: Number,
        notDone: Number,
        minutes: Number
      }
    ],
    sectionSummary: [
      {
        sectionName: String,
        pending: Number,
        done: Number
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("DailyReport", dailyReportSchema);
