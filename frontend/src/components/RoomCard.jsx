import { Clock3, MapPin, ShieldCheck } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function RoomCard({ room, workers = [], onAssign }) {
  return (
    <article className="panel svms-card-watermark p-4 transition hover:-translate-y-1 hover:border-orange-300">
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-black">{room.roomName}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-300">
              <MapPin size={14} /> Section {room.sectionCode} · {room.floorCode}
            </p>
          </div>
          <StatusBadge status={room.cleaningStatus} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-svmsOrange" /> Priority {room.priority}</span>
          <span className="flex items-center gap-2"><Clock3 size={16} className="text-svmsBlue dark:text-white" /> {room.cleaningTime?.min}-{room.cleaningTime?.max} min</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {(room.cleaningSteps || []).map((step) => (
            <div key={step.name} className={`rounded-xl px-2 py-2 text-center text-[11px] font-black ${step.done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"}`}>
              {step.name}
            </div>
          ))}
        </div>
        {onAssign && (
          <select
            value={room.assignedWorker?._id || ""}
            onChange={(event) => event.target.value && onAssign(room._id, event.target.value)}
            className="mt-4 w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-bold outline-none focus:border-svmsOrange dark:border-white/10 dark:bg-white/10"
          >
            <option value="">Assign worker</option>
            {workers.map((worker) => <option key={worker._id} value={worker._id}>Worker {worker.displayName}</option>)}
          </select>
        )}
      </div>
    </article>
  );
}
