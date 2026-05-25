import Room from "../models/Room.js";
import Staff from "../models/Staff.js";
import Task from "../models/Task.js";
import { cleaningSteps } from "../config/schoolStructure.js";
import { notify } from "./notificationService.js";
import { emitLive } from "./socketBus.js";
import { normalizeDate } from "../utils/date.js";

const priorityNames = {
  washroom: "Washrooms are hygiene-critical",
  admin: "Admin areas need early readiness",
  lab: "Labs require longer, careful cleaning",
  utility: "Utility points affect many students",
  large: "Large rooms need more cleaning time",
  classroom: "Classroom is pending for daily readiness",
  support: "Support room is pending"
};

function distance(worker, room) {
  const floorPenalty = worker.currentLocation.floor === room.floorCode ? 0 : 6;
  return Math.abs(worker.currentLocation.x - room.coordinates.x) + Math.abs(worker.currentLocation.y - room.coordinates.y) + floorPenalty;
}

function scoreWorker(worker, room) {
  const skillBonus = worker.skills.includes(room.roomType) ? -2 : 0;
  const floorBonus = worker.floorPreference === room.floorCode ? -1 : 0;
  return distance(worker, room) + worker.workloadScore + worker.performance.assigned * 0.35 + skillBonus + floorBonus - room.priority;
}

export async function recommendForRoom(room) {
  const workers = await Staff.find({ status: { $ne: "offline" } }).populate("user", "name role");
  if (!workers.length) return null;

  const ranked = workers
    .map((worker) => ({ worker, score: scoreWorker(worker, room), distance: distance(worker, room) }))
    .sort((a, b) => a.score - b.score);

  const best = ranked[0];
  return {
    worker: best.worker,
    score: Number(best.score.toFixed(2)),
    reason: `${best.worker.displayName} is nearest available with balanced workload. ${priorityNames[room.roomType] || "Room is pending"}. Distance ${best.distance}.`
  };
}

export async function generateRecommendations(limit = 12, dateInput = null) {
  const date = normalizeDate(dateInput);
  const doneRoomIds = await Task.find({ date, adminDecision: "Done" }).distinct("room");
  const rooms = await Room.find({ _id: { $nin: doneRoomIds } })
    .populate("floor section assignedWorker")
    .sort({ priority: -1, updatedAt: 1 })
    .limit(limit);

  const recommendations = [];
  for (const room of rooms) {
    const existing = await Task.findOne({
      room: room._id,
      date,
      adminDecision: "Pending",
      status: { $ne: "Done" }
    });
    if (existing) {
      recommendations.push(await populateTask(existing));
      continue;
    }

    const recommendation = await recommendForRoom(room);
    if (!recommendation) continue;

    const task = await Task.create({
      room: room._id,
      date,
      recommendedWorker: recommendation.worker._id,
      assignedTo: recommendation.worker._id,
      status: "In Progress",
      priority: room.priority,
      estimatedMinutes: room.cleaningTime.estimated,
      aiScore: recommendation.score,
      aiReason: recommendation.reason,
      cleaningSteps: cleaningSteps(),
      history: [{ action: "AI Recommended", note: recommendation.reason }]
    });

    room.assignedWorker = recommendation.worker._id;
    if (room.cleaningStatus === "Pending") room.cleaningStatus = "In Progress";
    await room.save();

    recommendation.worker.status = "busy";
    recommendation.worker.workloadScore += 1;
    recommendation.worker.performance.assigned += 1;
    await recommendation.worker.save();

    const populated = await populateTask(task);
    recommendations.push(populated);
    emitLive("task:recommended", populated);
    emitLive("room:updated", await Room.findById(room._id).populate("floor section assignedWorker"));
  }

  if (recommendations.length) {
    await notify({
      title: "AI recommendations ready",
      message: `${recommendations.length} room cleaning recommendation(s) prepared for ${date}.`,
      type: "info",
      audience: "all"
    });
  }

  return recommendations;
}

export async function recommendRoom(roomId, workerId = null, userId = null, dateInput = null) {
  const date = normalizeDate(dateInput);
  const room = await Room.findById(roomId).populate("floor section assignedWorker");
  if (!room) throw new Error("Room not found");
  const doneTask = await Task.findOne({ room: room._id, date, adminDecision: "Done" });
  if (doneTask) throw new Error("Room is already marked done for this date");

  const existing = await Task.findOne({
    room: room._id,
    date,
    adminDecision: "Pending",
    status: { $ne: "Done" }
  });

  if (existing) {
    if (workerId) return overrideAssignment(existing._id, workerId, userId);
    return populateTask(existing);
  }

  const recommendation = await recommendForRoom(room);
  if (!recommendation && !workerId) throw new Error("No available worker found");

  const selectedWorker = workerId ? await Staff.findById(workerId) : recommendation.worker;
  if (!selectedWorker) throw new Error("Worker not found");

  const task = await Task.create({
    room: room._id,
    date,
    recommendedWorker: recommendation?.worker?._id || selectedWorker._id,
    assignedTo: selectedWorker._id,
    assignedBy: userId,
    status: "In Progress",
    priority: room.priority,
    estimatedMinutes: room.cleaningTime.estimated,
    aiScore: recommendation?.score || 0,
    aiReason: recommendation?.reason || `Manually assigned to Worker ${selectedWorker.displayName}`,
    cleaningSteps: cleaningSteps(),
    history: [{ action: workerId ? "Manual Room Assignment" : "AI Room Recommendation", by: userId, note: recommendation?.reason || `Assigned to Worker ${selectedWorker.displayName}` }]
  });

  room.assignedWorker = selectedWorker._id;
  room.cleaningStatus = "In Progress";
  room.completedAt = null;
  await room.save();

  selectedWorker.status = "busy";
  selectedWorker.workloadScore += 1;
  selectedWorker.performance.assigned += 1;
  await selectedWorker.save();

  const populated = await populateTask(task);
  emitLive("task:recommended", populated);
  emitLive("room:updated", await Room.findById(room._id).populate("floor section assignedWorker"));
  await notify({
    title: workerId ? "Room assigned manually" : "AI room recommendation",
    message: `${room.roomName} assigned to Worker ${selectedWorker.displayName} for ${date}.`,
    type: workerId ? "info" : "success",
    audience: "all"
  });

  return populated;
}

export async function populateTask(task) {
  return task.populate([
    { path: "room", populate: [{ path: "floor" }, { path: "section" }, { path: "assignedWorker", populate: { path: "user", select: "name email role" } }] },
    { path: "recommendedWorker", populate: { path: "user", select: "name email role" } },
    { path: "assignedTo", populate: { path: "user", select: "name email role" } }
  ]);
}

export async function overrideAssignment(taskId, workerId, userId) {
  const task = await Task.findById(taskId);
  const room = await Room.findById(task.room);
  const worker = await Staff.findById(workerId);
  if (!task || !room || !worker) throw new Error("Task, room, or worker not found");

  task.assignedTo = worker._id;
  task.history.push({ action: "Manual Override", by: userId, note: `Assigned to ${worker.displayName}` });
  await task.save();

  room.assignedWorker = worker._id;
  room.cleaningStatus = "In Progress";
  await room.save();

  emitLive("task:updated", await populateTask(task));
  emitLive("room:updated", await Room.findById(room._id).populate("floor section assignedWorker"));
  return populateTask(task);
}

export async function verifyTask(taskId, decision, userId) {
  const task = await Task.findById(taskId).populate("assignedTo room");
  if (!task) throw new Error("Task not found");
  const room = await Room.findById(task.room._id);
  const worker = task.assignedTo ? await Staff.findById(task.assignedTo._id) : null;

  if (decision === "done") {
    const now = new Date();
    task.status = "Done";
    task.adminDecision = "Done";
    task.completedAt = now;
    task.actualMinutes = Math.max(5, Math.round((now - new Date(task.createdAt)) / 60000));
    task.cleaningSteps = task.cleaningSteps.map((step) => ({ ...step.toObject(), done: true, completedAt: now }));
    task.history.push({ action: "Marked DONE", by: userId, note: "Admin manually verified completion" });
    await task.save();

    room.cleaningStatus = "Done";
    room.completedAt = now;
    room.cleaningSteps = room.cleaningSteps.map((step) => ({ ...step.toObject(), done: true, completedAt: now }));
    await room.save();

    if (worker) {
      worker.status = "available";
      worker.currentLocation = { floor: room.floorCode, x: room.coordinates.x, y: room.coordinates.y };
      worker.workloadScore = Math.max(0, worker.workloadScore - 1);
      worker.performance.done += 1;
      worker.performance.totalMinutes += task.actualMinutes;
      await worker.save();
    }

    await notify({ title: "Room marked done", message: `${room.roomName} has been manually verified as DONE.`, type: "success", audience: "all" });
  } else {
    task.status = "Pending";
    task.adminDecision = "Not Done";
    task.history.push({ action: "Marked NOT DONE", by: userId, note: "Admin found room incomplete" });
    await task.save();

    room.cleaningStatus = "Pending";
    room.completedAt = null;
    room.cleaningSteps = cleaningSteps();
    await room.save();

    if (worker) {
      worker.status = "available";
      worker.workloadScore = Math.max(0, worker.workloadScore - 1);
      worker.performance.notDone += 1;
      await worker.save();
    }

    await notify({ title: "Room needs attention", message: `${room.roomName} was marked NOT DONE and returned to pending.`, type: "warning", audience: "all" });
  }

  const populated = await populateTask(await Task.findById(task._id));
  emitLive("task:updated", populated);
  emitLive("room:updated", await Room.findById(room._id).populate("floor section assignedWorker"));

  if (decision === "done") {
    const next = await suggestNextNearbyRoom(worker?._id);
    if (next) emitLive("ai:nextSuggestion", next);
  }

  return populated;
}

export async function verifyRoom(roomId, decision, userId, dateInput = null) {
  const date = normalizeDate(dateInput);
  const activeTask = await Task.findOne({
    room: roomId,
    date,
    adminDecision: "Pending",
    status: { $ne: "Done" }
  });

  if (activeTask) return verifyTask(activeTask._id, decision, userId);

  const room = await Room.findById(roomId);
  if (!room) throw new Error("Room not found");

  if (decision === "not_done") {
    room.cleaningStatus = "Pending";
    room.completedAt = null;
    room.cleaningSteps = cleaningSteps();
    await room.save();

    const task = await Task.create({
      room: room._id,
      date,
      assignedTo: room.assignedWorker,
      recommendedWorker: room.assignedWorker,
      assignedBy: userId,
      status: "Pending",
      adminDecision: "Not Done",
      priority: room.priority,
      estimatedMinutes: room.cleaningTime.estimated,
      aiReason: "Admin reopened this room as NOT DONE from section verification.",
      cleaningSteps: cleaningSteps(),
      history: [{ action: "Room Reopened NOT DONE", by: userId, note: "Admin manually corrected completed room" }]
    });

    await notify({ title: "Room reopened", message: `${room.roomName} was changed to NOT DONE.`, type: "warning", audience: "all" });
    emitLive("room:updated", await Room.findById(room._id).populate("floor section assignedWorker"));
    return populateTask(task);
  }

  const task = await recommendRoom(roomId, null, userId, date);
  return verifyTask(task._id, "done", userId);
}

export async function suggestNextNearbyRoom(workerId) {
  if (!workerId) return null;
  const worker = await Staff.findById(workerId);
  const pendingRooms = await Room.find({ cleaningStatus: "Pending" }).populate("floor section");
  if (!worker || !pendingRooms.length) return null;

  const best = pendingRooms
    .map((room) => ({ room, score: distance(worker, room) - room.priority }))
    .sort((a, b) => a.score - b.score)[0];

  return {
    worker,
    room: best.room,
    score: Number(best.score.toFixed(2)),
    reason: `Next nearby recommendation for ${worker.displayName}: ${best.room.roomName}`
  };
}
