import { UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../services/api";

export default function WorkerManagement() {
  const [workers, setWorkers] = useState([]);

  async function load() {
    const res = await api.get("/staff");
    setWorkers(res.data);
  }

  useEffect(() => { load(); }, []);

  async function setStatus(worker, status) {
    await api.patch(`/staff/${worker._id}`, { status });
    load();
  }

  const chart = workers.map((worker) => ({ name: worker.displayName, assigned: worker.performance.assigned, done: worker.performance.done, notDone: worker.performance.notDone }));

  return (
    <div className="space-y-5">
      <div className="panel p-5">
        <h2 className="flex items-center gap-2 text-2xl font-black"><UsersRound size={24} /> Worker Management</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-300">Group D staff A-E with workload balancing and availability control.</p>
      </div>
      <section className="panel p-5">
        <h3 className="mb-4 font-black">Worker Performance</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="assigned" fill="#0b2447" radius={[8, 8, 0, 0]} />
              <Bar dataKey="done" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="notDone" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <div className="grid gap-4 xl:grid-cols-2">
        {workers.map((worker) => (
          <article key={worker._id} className="panel svms-card-watermark p-5">
            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-svmsOrange">Worker {worker.displayName}</p>
                <h3 className="text-xl font-black">{worker.user?.name}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">{worker.employeeCode} · {worker.status} · workload {worker.workloadScore}</p>
              </div>
              <select value={worker.status} onChange={(e) => setStatus(worker, e.target.value)} className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-bold dark:border-white/10 dark:bg-white/10">
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div className="relative z-10 mt-4 flex flex-wrap gap-2">
              {worker.skills.map((skill) => <span key={skill} className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 dark:bg-orange-500/15 dark:text-orange-200">{skill}</span>)}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
