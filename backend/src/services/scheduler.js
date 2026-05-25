import cron from "node-cron";
import Room from "../models/Room.js";
import Task from "../models/Task.js";
import { cleaningSteps } from "../config/schoolStructure.js";
import { notify } from "./notificationService.js";
import { todayKey } from "../utils/date.js";

export function startSchedulers() {
  cron.schedule("0 6 * * *", async () => {
    try {
      await Room.updateMany(
        {},
        {
          cleaningStatus: "Pending",
          completedAt: null,
          assignedWorker: null,
          cleaningSteps: cleaningSteps()
        }
      );
      await notify({
        title: "Daily cleaning cycle opened",
        message: `All rooms are pending for manual verification on ${todayKey()}.`,
        type: "info",
        audience: "all"
      });
    } catch (error) {
      console.error("Daily reset scheduler failed", error.message);
    }
  });
}
