import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function DailyReports() {
  const [reports, setReports] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  async function load() {
    const res = await api.get("/reports");
    setReports(res.data);
  }

  useEffect(() => { load(); }, []);

  async function generate() {
    await api.post("/reports/generate", { date });
    load();
  }

  return (
    <div className="space-y-5">
      <div className="panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-black"><FileText size={24} /> Daily Reports</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-300">Generate report snapshots for admin review and future export.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-bold dark:border-white/10 dark:bg-white/10" />
          <button className="premium-button" onClick={generate}>Generate Report</button>
        </div>
      </div>
      <div className="panel overflow-hidden">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-svmsBlue text-white">
            <tr><th className="p-4">Date</th><th>Rooms</th><th>Cleaned</th><th>Pending</th><th>In Progress</th><th>Fastest</th><th>Avg Min</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/10">
            {reports.map((report) => (
              <tr key={report._id} className="bg-white/50 dark:bg-white/5">
                <td className="p-4 font-black">{report.date}</td>
                <td>{report.totalRooms}</td>
                <td>{report.cleanedRooms}</td>
                <td>{report.pendingRooms}</td>
                <td>{report.inProgressRooms}</td>
                <td>{report.fastestWorker}</td>
                <td>{report.averageCleaningTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
