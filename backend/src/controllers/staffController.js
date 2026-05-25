import Attendance from "../models/Attendance.js";
import Staff from "../models/Staff.js";
import User from "../models/User.js";
import { emitLive } from "../services/socketBus.js";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function getStaff(req, res) {
  res.json(await Staff.find().populate("user", "name email role active").sort({ displayName: 1 }));
}

export async function createStaff(req, res) {
  const { name, email, password, role = "staff", ...staffData } = req.body;
  const user = await User.create({ name, email, password, role });
  const staff = await Staff.create({ ...staffData, displayName: staffData.displayName || name, user: user._id });
  res.status(201).json(await staff.populate("user", "name email role active"));
}

export async function updateStaff(req, res) {
  const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("user", "name email role active");
  if (!staff) return res.status(404).json({ message: "Staff not found" });
  emitLive("staff:updated", staff);
  res.json(staff);
}

export async function markAttendance(req, res) {
  const date = req.body.date || todayKey();
  const attendance = await Attendance.findOneAndUpdate(
    { staff: req.params.staffId, date },
    {
      status: req.body.status,
      remarks: req.body.remarks,
      checkIn: ["present", "late"].includes(req.body.status) ? new Date() : undefined
    },
    { upsert: true, new: true, runValidators: true }
  ).populate({ path: "staff", populate: { path: "user", select: "name email role" } });

  const staffStatus = ["absent", "leave"].includes(attendance.status) ? "offline" : "available";
  await Staff.findByIdAndUpdate(req.params.staffId, { status: staffStatus });
  emitLive("attendance:updated", attendance);
  res.json(attendance);
}

export async function getAttendance(req, res) {
  res.json(await Attendance.find({ date: req.query.date || todayKey() }).populate({ path: "staff", populate: { path: "user", select: "name email role" } }));
}
