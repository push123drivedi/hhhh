import Notification from "../models/Notification.js";
import { emitLive } from "./socketBus.js";

export async function notify({ title, message, type = "info", audience = "all", staff = null }) {
  const notification = await Notification.create({ title, message, type, audience, staff });
  emitLive("notification:new", notification);
  return notification;
}
