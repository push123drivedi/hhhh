import Room from "../models/Room.js";
import Staff from "../models/Staff.js";
import Task from "../models/Task.js";
import Notification from "../models/Notification.js";
import { normalizeDate } from "../utils/date.js";

export async function getDashboardStats(dateInput = null) {
  const date = normalizeDate(dateInput);
  const [rooms, staff, tasks, notifications] = await Promise.all([
    Room.find().populate("floor section assignedWorker"),
    Staff.find().populate("user", "name email role"),
    Task.find({ date }).populate([
      { path: "room", populate: [{ path: "floor" }, { path: "section" }] },
      { path: "assignedTo", populate: { path: "user", select: "name email role" } },
      { path: "recommendedWorker", populate: { path: "user", select: "name email role" } }
    ]).sort({ updatedAt: -1 }).limit(30),
    Notification.find().sort({ createdAt: -1 }).limit(12)
  ]);

  const totalRooms = rooms.length;
  const doneRoomIds = new Set(tasks.filter((task) => task.adminDecision === "Done").map((task) => String(task.room?._id)));
  const inProgressRoomIds = new Set(tasks.filter((task) => task.adminDecision === "Pending" && task.status === "In Progress").map((task) => String(task.room?._id)));
  const notDoneRoomIds = new Set(tasks.filter((task) => task.adminDecision === "Not Done").map((task) => String(task.room?._id)));
  const cleanedRooms = doneRoomIds.size;
  const inProgressRooms = [...inProgressRoomIds].filter((roomId) => !doneRoomIds.has(roomId)).length;
  const pendingRooms = Math.max(0, totalRooms - cleanedRooms - inProgressRooms);

  const workerPerformance = staff.map((worker) => ({
    name: worker.displayName,
    assigned: tasks.filter((task) => String(task.assignedTo?._id) === String(worker._id)).length,
    done: tasks.filter((task) => String(task.assignedTo?._id) === String(worker._id) && task.adminDecision === "Done").length,
    notDone: tasks.filter((task) => String(task.assignedTo?._id) === String(worker._id) && task.adminDecision === "Not Done").length,
    minutes: tasks.filter((task) => String(task.assignedTo?._id) === String(worker._id)).reduce((sum, task) => sum + (task.actualMinutes || 0), 0)
  }));

  const sectionStatus = [...new Map(rooms.map((room) => [room.sectionCode, room.section])).values()]
    .filter(Boolean)
    .map((section) => {
      const sectionRooms = rooms.filter((room) => String(room.section?._id) === String(section._id));
      return {
        code: section.sectionCode,
        name: section.sectionName,
        floor: sectionRooms[0]?.floorCode,
        total: sectionRooms.length,
        done: sectionRooms.filter((room) => doneRoomIds.has(String(room._id))).length,
        pending: sectionRooms.filter((room) => !doneRoomIds.has(String(room._id))).length
      };
    });

  const fastestWorker = workerPerformance
    .filter((worker) => worker.done > 0)
    .map((worker) => ({ name: worker.name, avg: worker.minutes / worker.done }))
    .sort((a, b) => a.avg - b.avg)[0];

  const roomTypeAnalytics = Object.values(
    rooms.reduce((acc, room) => {
      acc[room.roomType] ||= { type: room.roomType, total: 0, done: 0 };
      acc[room.roomType].total += 1;
      if (doneRoomIds.has(String(room._id))) acc[room.roomType].done += 1;
      return acc;
    }, {})
  );

  return {
    schoolName: "St. Vivekanand Millennium School",
    date,
    totals: {
      totalRooms,
      cleanedRooms,
      pendingRooms,
      inProgressRooms,
      completionPercentage: totalRooms ? Math.round((cleanedRooms / totalRooms) * 100) : 0,
      fastestWorker: fastestWorker?.name || "Pending"
    },
    workerPerformance,
    sectionStatus,
    roomTypeAnalytics,
    livePendingRooms: rooms.filter((room) => !doneRoomIds.has(String(room._id))).sort((a, b) => b.priority - a.priority).slice(0, 10),
    aiRecommendations: tasks.filter((task) => task.adminDecision === "Pending" && task.status !== "Done").slice(0, 8),
    liveActivity: [
      ...tasks.slice(0, 8).map((task) => ({
        id: task._id,
        title: task.room?.roomName || "Room task",
        message: `${task.assignedTo?.displayName || "AI"} - ${task.status}`,
        type: task.adminDecision === "Not Done" ? "warning" : "info",
        at: task.updatedAt
      })),
      ...notifications.map((item) => ({
        id: item._id,
        title: item.title,
        message: item.message,
        type: item.type,
        at: item.createdAt
      }))
    ].sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 12)
  };
}
