import { Layers3 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function SectionManagement() {
  const [sections, setSections] = useState([]);
  const [floor, setFloor] = useState("");

  useEffect(() => {
    api.get("/floors/sections/all", { params: floor ? { floor } : {} }).then((res) => setSections(res.data));
  }, [floor]);

  return (
    <div className="space-y-5">
      <div className="panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-black"><Layers3 size={24} /> Section Management</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-300">Section cards for Admin Row through Staff Area.</p>
        </div>
        <select value={floor} onChange={(event) => setFloor(event.target.value)} className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-bold dark:border-white/10 dark:bg-white/10">
          <option value="">All floors</option>
          <option value="GROUND">Ground Floor</option>
          <option value="FIRST">First Floor</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const percent = section.totalRooms ? Math.round((section.doneRooms / section.totalRooms) * 100) : 0;
          return (
            <article key={section._id} className="panel svms-card-watermark p-5 transition hover:-translate-y-1 hover:border-orange-300">
              <div className="relative z-10">
                <p className="text-sm font-black text-svmsOrange">Section {section.sectionCode}</p>
                <h3 className="mt-1 text-xl font-black">{section.sectionName}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">{section.floor?.floorName}</p>
                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div className="h-full rounded-full bg-svmsOrange" style={{ width: `${percent}%` }} />
                </div>
                <div className="mt-4 flex justify-between text-sm font-black">
                  <span>{section.doneRooms} done</span>
                  <span className="text-svmsOrange">{section.pendingRooms} pending</span>
                </div>
                <Link to={`/sections/${section.sectionCode}`} className="premium-button mt-5 w-full">
                  Open Section
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
