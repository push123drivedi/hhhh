import Room from "../models/Room.js";
import { emitLive } from "../services/socketBus.js";

export async function getRooms(req, res) {
  const query = {};
  if (req.query.floor) query.floorCode = req.query.floor;
  if (req.query.section) query.sectionCode = req.query.section;
  if (req.query.status) query.cleaningStatus = req.query.status;
  if (req.query.worker) query.assignedWorker = req.query.worker;
  if (req.query.search) query.$text = { $search: req.query.search };

  const rooms = await Room.find(query)
    .populate("floor section assignedWorker")
    .sort({ floorCode: 1, sectionCode: 1, priority: -1, roomName: 1 });
  res.json(rooms);
}

export async function getRoom(req, res) {
  const room = await Room.findById(req.params.id).populate("floor section assignedWorker");
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json(room);
}

export async function updateRoom(req, res) {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("floor section assignedWorker");
  if (!room) return res.status(404).json({ message: "Room not found" });
  emitLive("room:updated", room);
  res.json(room);
}
