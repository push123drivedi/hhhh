import { ArrowLeft, CheckCircle2, Sparkles, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { api } from "../services/api";
import { getSocket } from "../services/socket";

export default function SectionDetail() {
  const { sectionCode } = useParams();
  const [rooms, setRooms] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [busyRoom, setBusyRoom] = useState("");

  async function load() {
    const [roomRes, taskRes, staffRes] = await Promise.all([
      api.get("/rooms", { params: { section: sectionCode } }),
      api.get("/tasks"),
      api.get("/staff")
    ]);
    setRooms(roomRes.data);
    setTasks(taskRes.data);
    setWorkers(staffRes.data);
  }

  useEffect(() => {
    load();
    const socket = getSocket();
    socket.connect();
    ["room:updated", "task:updated", "task:recommended"].forEach((event) => socket.on(event, load));
    return () => ["room:updated", "task:updated", "task:recommended"].forEach((event) => socket.off(event, load));
  }, [sectionCode]);

  const sectionName = rooms[0]?.section?.sectionName || `Section ${sectionCode}`;
  const floorName = rooms[0]?.floor?.floorName || "";
  const taskByRoom = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      const roomId = task.room?._id;
      if (roomId && task.status !== "Done" && task.adminDecision !== "Done") map[roomId] = task;
    });
    return map;
  }, [tasks]);

  async function assign(roomId, workerId = "") {
    setBusyRoom(roomId);
    try {
      await api.post("/tasks/recommend", { roomId, workerId: workerId || undefined });
      await load();
    } finally {
      setBusyRoom("");
    }
  }

  async function verify(room, decision) {
    setBusyRoom(room._id);
    try {
      await api.patch(`/tasks/room/${room._id}/verify`, { decision });
      await load();
    } finally {
      setBusyRoom("");
    }
  }

  const totals = {
    total: rooms.length,
    done: rooms.filter((room) => room.cleaningStatus === "Done").length,
    pending: rooms.filter((room) => room.cleaningStatus === "Pending").length,
    progress: rooms.filter((room) => room.cleaningStatus === "In Progress").length
  };

  return (
    <div className="space-y-5">
      <section className="panel svms-card-watermark p-5">
        <div className="relative z-10 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <Link to="/sections" className="mb-3 inline-flex items-center gap-2 text-sm font-black text-svmsOrange">
              <ArrowLeft size={16} /> Back to sections
            </Link>
            <p className="text-sm font-black uppercase tracking-wide text-svmsOrange">Section {sectionCode}</p>
            <h2 className="text-3xl font-black">{sectionName}</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-300">{floorName} · assign room work and verify DONE / NOT DONE here.</p>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/10"><p className="text-2xl font-black">{totals.total}</p><p className="text-xs font-bold text-slate-500">Rooms</p></div>
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-500/10"><p className="text-2xl font-black">{totals.done}</p><p className="text-xs font-bold">Done</p></div>
            <div className="rounded-2xl bg-orange-50 p-3 text-orange-700 dark:bg-orange-500/10"><p className="text-2xl font-black">{totals.pending}</p><p className="text-xs font-bold">Pending</p></div>
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-500/10"><p className="text-2xl font-black">{totals.progress}</p><p className="text-xs font-bold">Working</p></div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {rooms.map((room) => {
          const task = taskByRoom[room._id];
          return (
            <article key={room._id} className="panel svms-card-watermark p-5">
              <div className="relative z-10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-black">{room.roomName}</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">
                      {room.roomType} · Priority {room.priority} · {room.cleaningTime?.min}-{room.cleaningTime?.max} min
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-400">
                      Assigned: {task?.assignedTo?.displayName || room.assignedWorker?.displayName || "Not assigned"}
                    </p>
                  </div>
                  <StatusBadge status={room.cleaningStatus} />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {(room.cleaningSteps || []).map((step) => (
                    <div key={step.name} className={`rounded-xl px-2 py-2 text-center text-xs font-black ${step.done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"}`}>
                      {step.done ? "✓ " : ""}{step.name}
                    </div>
                  ))}
                </div>

                {task?.aiReason && (
                  <p className="mt-4 rounded-2xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 dark:bg-blue-500/10 dark:text-blue-200">{task.aiReason}</p>
                )}

                <div className="mt-5 grid gap-2 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
                  <select
                    value={task?.assignedTo?._id || room.assignedWorker?._id || ""}
                    onChange={(event) => assign(room._id, event.target.value)}
                    disabled={busyRoom === room._id || room.cleaningStatus === "Done"}
                    className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-bold dark:border-white/10 dark:bg-white/10"
                  >
                    <option value="">Select worker</option>
                    {workers.map((worker) => <option key={worker._id} value={worker._id}>Worker {worker.displayName}</option>)}
                  </select>
                  <button disabled={busyRoom === room._id || room.cleaningStatus === "Done"} className="blue-button" onClick={() => assign(room._id)}>
                    <Sparkles size={17} /> AI
                  </button>
                  <button disabled={busyRoom === room._id || room.cleaningStatus === "Done"} className="premium-button bg-emerald-600 hover:bg-emerald-700" onClick={() => verify(room, "done")}>
                    <CheckCircle2 size={17} /> Done
                  </button>
                  <button disabled={busyRoom === room._id} className="premium-button bg-red-600 hover:bg-red-700" onClick={() => verify(room, "not_done")}>
                    <XCircle size={17} /> Not Done
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
