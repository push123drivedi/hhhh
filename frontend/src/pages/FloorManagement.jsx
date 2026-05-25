import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function FloorManagement() {
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    api.get("/floors").then((res) => setFloors(res.data));
  }, []);

  return (
    <div className="space-y-5">
      <div className="panel svms-card-watermark p-5">
        <h2 className="relative z-10 flex items-center gap-2 text-2xl font-black"><Building2 size={24} /> Floor Management</h2>
        <p className="relative z-10 mt-2 text-sm font-semibold text-slate-500 dark:text-slate-300">Monitor each floor, section coverage, and completion progress.</p>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {floors.map((floor) => {
          const percent = floor.totalRooms ? Math.round((floor.doneRooms / floor.totalRooms) * 100) : 0;
          return (
            <article key={floor._id} className="panel svms-card-watermark p-5">
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-black uppercase text-svmsOrange">{floor.floorCode}</p>
                    <h3 className="text-2xl font-black">{floor.floorName}</h3>
                  </div>
                  <span className="rounded-full bg-svmsBlue px-3 py-1 text-sm font-black text-white dark:bg-svmsOrange">{percent}%</span>
                </div>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div className="h-full rounded-full bg-svmsOrange" style={{ width: `${percent}%` }} />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/10"><p className="text-2xl font-black">{floor.totalRooms}</p><p className="text-xs font-bold text-slate-500">Rooms</p></div>
                  <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/10"><p className="text-2xl font-black">{floor.doneRooms}</p><p className="text-xs font-bold text-slate-500">Done</p></div>
                  <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/10"><p className="text-2xl font-black">{floor.pendingRooms}</p><p className="text-xs font-bold text-slate-500">Pending</p></div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {floor.sections?.map((section) => <span key={section._id} className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 dark:bg-orange-500/15 dark:text-orange-200">Section {section.sectionCode}</span>)}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
