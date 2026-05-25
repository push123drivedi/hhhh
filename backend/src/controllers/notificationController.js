import Notification from "../models/Notification.js";

export async function getNotifications(req, res) {
  res.json(await Notification.find().sort({ createdAt: -1 }).limit(30));
}
