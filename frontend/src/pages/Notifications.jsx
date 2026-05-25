import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { getSocket } from "../services/socket";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  async function load() {
    const res = await api.get("/notifications");
    setNotifications(res.data);
  }

  useEffect(() => {
    load();
    const socket = getSocket();
    socket.connect();
    socket.on("notification:new", load);
    return () => socket.off("notification:new", load);
  }, []);

  return (
    <div className="space-y-5">
      <div className="panel p-5">
        <h2 className="flex items-center gap-2 text-2xl font-black"><Bell size={24} /> Notifications</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-300">Real-time duty updates, pending alerts, and report events.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {notifications.map((item) => (
          <article key={item._id} className="panel svms-card-watermark p-5">
            <div className="relative z-10">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase text-orange-700 dark:bg-orange-500/15 dark:text-orange-200">{item.type}</span>
              <h3 className="mt-3 text-lg font-black">{item.title}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">{item.message}</p>
              <p className="mt-3 text-xs font-bold text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
