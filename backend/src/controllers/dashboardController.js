import { getDashboardStats } from "../services/dashboardService.js";

export async function dashboard(req, res) {
  res.json(await getDashboardStats(req.query.date));
}
