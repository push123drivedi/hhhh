import { BrainCircuit, CheckCircle2, Clock3, DoorOpen, RefreshCw, TimerReset } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import StatCard from "../components/StatCard";
import TaskList from "../components/TaskList";
import { api } from "../services/api";
import { getSocket } from "../services/socket";

const pieColors = ["#f47721", "#0b2447", "#38bdf8", "#10b981", "#ef4444"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [busy, setBusy] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  async function load() {
    const [dashboard, staff] = await Promise.all([
      api.get("/dashboard", { params: { date: selectedDate } }),
      api.get("/staff")
    ]);
    setData(dashboard.data);
    setWorkers(staff.data);
  }

  useEffect(() => {
    load();
    const socket = getSocket();
    socket.connect();
    ["task:recommended", "task:updated", "room:updated", "notification:new"].forEach((event) => socket.on(event, load));
    return () => ["task:recommended", "task:updated", "room:updated", "notification:new"].forEach((event) => socket.off(event, load));
  }, [selectedDate]);

  async function recommend() {
    setBusy(true);
    try {
      await api.post("/tasks/recommend", { limit: 12, date: selectedDate });
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function startTask(id) {
    await api.patch(`/tasks/${id}/start`);
    load();
  }

  async function verify(id, decision) {
    await api.patch(`/tasks/${id}/verify`, { decision, date: selectedDate });
    load();
  }

  async function assign(taskId, workerId) {
    await api.patch(`/tasks/${taskId}/assign`, { workerId });
    load();
  }

  const totals = data?.totals || {};

  return (
    <div className="space-y-5">
      <section className="panel svms-card-watermark p-5">
        <div className="relative z-10 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-svmsOrange">Production dashboard</p>
            <h2 className="mt-1 text-3xl font-black">AI Recommendation + Manual Verification</h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold text-slate-500 dark:text-slate-300">Date-wise cleaning cycle: select any day, generate AI recommendations, and review stored DONE / NOT DONE records.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white/85 px-4 py-2.5 text-sm font-black outline-none focus:border-svmsOrange dark:border-white/10 dark:bg-white/10"
            />
            <button className="premium-button" onClick={recommend} disabled={busy}>
              {busy ? <RefreshCw className="animate-spin" size={18} /> : <BrainCircuit size={18} />} Generate AI Recommendations
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Rooms" value={totals.totalRooms} icon={DoorOpen} accent="blue" />
        <StatCard label="Cleaned Today" value={totals.cleanedRooms} icon={CheckCircle2} accent="green" helper={`${totals.completionPercentage || 0}% complete`} />
        <StatCard label="Pending Rooms" value={totals.pendingRooms} icon={Clock3} accent="orange" />
        <StatCard label="In Progress" value={totals.inProgressRooms} icon={TimerReset} accent="blue" />
        <StatCard label="Fastest Worker" value={totals.fastestWorker || "-"} icon={BrainCircuit} accent="orange" helper="Based on verified tasks" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="panel p-5">
          <h3 className="mb-4 font-black">Worker-wise Tasks</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.workerPerformance || []}>
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

        <section className="panel p-5">
          <h3 className="mb-4 font-black">Room Completion %</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[
                  { name: "Done", value: totals.cleanedRooms || 0 },
                  { name: "Pending", value: totals.pendingRooms || 0 },
                  { name: "In Progress", value: totals.inProgressRooms || 0 }
                ]} dataKey="value" nameKey="name" innerRadius={58} outerRadius={95} paddingAngle={4}>
                  {[0, 1, 2].map((index) => <Cell key={index} fill={pieColors[index]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <TaskList tasks={data?.aiRecommendations || []} workers={workers} onStart={startTask} onVerify={verify} onAssign={assign} />

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="panel p-5">
          <h3 className="mb-4 font-black">Pending Section Alerts</h3>
          <div className="space-y-3">
            {(data?.sectionStatus || []).filter((section) => section.pending > 0).map((section) => (
              <div key={section.code} className="rounded-2xl border border-orange-100 bg-orange-50/75 p-4 dark:border-orange-500/20 dark:bg-orange-500/10">
                <div className="flex items-center justify-between">
                  <p className="font-black">Section {section.code} - {section.name}</p>
                  <span className="text-sm font-black text-svmsOrange">{section.pending} pending</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white dark:bg-white/10">
                  <div className="h-full rounded-full bg-svmsOrange" style={{ width: `${section.total ? (section.done / section.total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-5">
          <h3 className="mb-4 font-black">Live Activity Feed</h3>
          <div className="space-y-3">
            {(data?.liveActivity || []).map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 bg-white/65 p-4 dark:border-white/10 dark:bg-white/6">
                <p className="font-black">{item.title}</p>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{item.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
