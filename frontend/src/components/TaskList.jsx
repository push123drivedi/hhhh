import { CheckCircle2, PlayCircle, XCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function TaskList({ tasks = [], workers = [], onStart, onVerify, onAssign }) {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-white/70 px-5 py-4 dark:border-white/10">
        <h2 className="font-black">AI Recommendations + Manual Verification</h2>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/10">
        {tasks.length ? tasks.map((task) => (
          <div key={task._id} className="grid gap-3 px-5 py-4 xl:grid-cols-[1fr_210px_250px] xl:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-black">{task.room?.roomName}</p>
                <StatusBadge status={task.adminDecision === "Not Done" ? "Not Done" : task.status} />
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">
                AI: Worker {task.recommendedWorker?.displayName} · Assigned: Worker {task.assignedTo?.displayName || "-"} · {task.estimatedMinutes} min
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{task.aiReason}</p>
            </div>
            <select
              value={task.assignedTo?._id || ""}
              onChange={(event) => event.target.value && onAssign?.(task._id, event.target.value)}
              className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-bold dark:border-white/10 dark:bg-white/10"
            >
              <option value="">Override worker</option>
              {workers.map((worker) => <option key={worker._id} value={worker._id}>Worker {worker.displayName}</option>)}
            </select>
            <div className="flex flex-wrap gap-2 xl:justify-end">
              <button className="blue-button" onClick={() => onStart?.(task._id)}><PlayCircle size={17} /> Start</button>
              <button className="premium-button bg-emerald-600 hover:bg-emerald-700" onClick={() => onVerify?.(task._id, "done")}><CheckCircle2 size={17} /> Done</button>
              <button className="premium-button bg-red-600 hover:bg-red-700" onClick={() => onVerify?.(task._id, "not_done")}><XCircle size={17} /> Not Done</button>
            </div>
          </div>
        )) : (
          <p className="px-5 py-10 text-center text-sm font-semibold text-slate-500">No recommendations yet. Generate AI recommendations to begin.</p>
        )}
      </div>
    </div>
  );
}
