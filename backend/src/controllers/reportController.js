import DailyReport from "../models/DailyReport.js";
import Room from "../models/Room.js";
import Staff from "../models/Staff.js";
import Task from "../models/Task.js";
import { normalizeDate } from "../utils/date.js";

export async function generateDailyReport(req, res) {
  const date = normalizeDate(req.body.date);
  const [rooms, staff, tasks] = await Promise.all([
    Room.find().populate("section"),
    Staff.find().populate("user", "name email role"),
    Task.find({ date }).populate("room assignedTo")
  ]);

  const workerSummary = staff.map((worker) => ({
    workerName: worker.displayName,
    assigned: tasks.filter((task) => String(task.assignedTo?._id) === String(worker._id)).length,
    done: tasks.filter((task) => String(task.assignedTo?._id) === String(worker._id) && task.adminDecision === "Done").length,
    notDone: tasks.filter((task) => String(task.assignedTo?._id) === String(worker._id) && task.adminDecision === "Not Done").length,
    minutes: tasks.filter((task) => String(task.assignedTo?._id) === String(worker._id)).reduce((sum, task) => sum + (task.actualMinutes || 0), 0)
  }));

  const fastest = workerSummary
    .filter((worker) => worker.done > 0)
    .map((worker) => ({ ...worker, avg: worker.minutes / worker.done }))
    .sort((a, b) => a.avg - b.avg)[0];

  const sections = Object.values(
    rooms.reduce((acc, room) => {
      const key = room.sectionCode;
      acc[key] ||= { sectionName: `${room.sectionCode} - ${room.section?.sectionName || ""}`, pending: 0, done: 0 };
      const done = tasks.some((task) => String(task.room?._id || task.room) === String(room._id) && task.adminDecision === "Done");
      if (done) acc[key].done += 1;
      else acc[key].pending += 1;
      return acc;
    }, {})
  );

  const report = await DailyReport.findOneAndUpdate(
    { date },
    {
      date,
      totalRooms: rooms.length,
      cleanedRooms: tasks.filter((task) => task.adminDecision === "Done").length,
      pendingRooms: Math.max(0, rooms.length - tasks.filter((task) => task.adminDecision === "Done").length - tasks.filter((task) => task.adminDecision === "Pending" && task.status === "In Progress").length),
      inProgressRooms: tasks.filter((task) => task.adminDecision === "Pending" && task.status === "In Progress").length,
      fastestWorker: fastest?.workerName || "Pending",
      averageCleaningTime: workerSummary.length ? Math.round(workerSummary.reduce((sum, worker) => sum + worker.minutes, 0) / Math.max(1, workerSummary.reduce((sum, worker) => sum + worker.done, 0))) : 0,
      workerSummary,
      sectionSummary: sections
    },
    { upsert: true, new: true, runValidators: true }
  );

  res.json(report);
}

export async function getReports(req, res) {
  res.json(await DailyReport.find(req.query.date ? { date: req.query.date } : {}).sort({ date: -1 }).limit(30));
}
