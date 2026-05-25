import Task from "../models/Task.js";
import { generateRecommendations, overrideAssignment, populateTask, recommendRoom, verifyRoom, verifyTask } from "../services/aiAssignmentService.js";

export async function getTasks(req, res) {
  const query = {};
  if (req.query.date) query.date = req.query.date;
  if (req.query.status) query.status = req.query.status;
  if (req.query.worker) query.assignedTo = req.query.worker;
  if (req.query.decision) query.adminDecision = req.query.decision;

  const tasks = await Task.find(query)
    .populate([
      { path: "room", populate: [{ path: "floor" }, { path: "section" }] },
      { path: "recommendedWorker", populate: { path: "user", select: "name email role" } },
      { path: "assignedTo", populate: { path: "user", select: "name email role" } }
    ])
    .sort({ priority: -1, updatedAt: -1 });
  res.json(tasks);
}

export async function recommendTasks(req, res) {
  if (req.body.roomId) {
    const recommendation = await recommendRoom(req.body.roomId, req.body.workerId, req.user._id, req.body.date);
    return res.status(201).json(recommendation);
  }
  const recommendations = await generateRecommendations(Number(req.body.limit || 12), req.body.date);
  res.status(201).json(recommendations);
}

export async function assignTask(req, res) {
  res.json(await overrideAssignment(req.params.id, req.body.workerId, req.user._id));
}

export async function markTask(req, res) {
  const decision = req.body.decision;
  if (!["done", "not_done"].includes(decision)) {
    return res.status(400).json({ message: "decision must be done or not_done" });
  }
  res.json(await verifyTask(req.params.id, decision, req.user._id));
}

export async function markRoom(req, res) {
  const decision = req.body.decision;
  if (!["done", "not_done"].includes(decision)) {
    return res.status(400).json({ message: "decision must be done or not_done" });
  }
  res.json(await verifyRoom(req.params.roomId, decision, req.user._id, req.body.date));
}

export async function startTask(req, res) {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  task.status = "In Progress";
  task.startedAt = task.startedAt || new Date();
  task.history.push({ action: "Started", by: req.user._id });
  await task.save();
  res.json(await populateTask(task));
}
