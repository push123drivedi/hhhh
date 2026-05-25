import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import { api } from "../services/api";
import { getSocket } from "../services/socket";

export default function RoomStatus() {
  const [rooms, setRooms] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [filters, setFilters] = useState({ floor: "", section: "", status: "", search: "" });

  async function load() {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    const [roomRes, staffRes] = await Promise.all([api.get("/rooms", { params }), api.get("/staff")]);
    setRooms(roomRes.data);
    setWorkers(staffRes.data);
  }

  useEffect(() => {
    load();
  }, [filters.floor, filters.section, filters.status]);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();
    socket.on("room:updated", load);
    return () => socket.off("room:updated", load);
  }, [filters]);

  async function search(event) {
    event.preventDefault();
    await load();
  }

  async function assignRoom(roomId, workerId) {
    await api.patch(`/rooms/${roomId}`, { assignedWorker: workerId, cleaningStatus: "In Progress" });
    load();
  }

  return (
    <div className="space-y-5">
      <form onSubmit={search} className="panel flex flex-col gap-3 p-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-black">Room Status</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">Filter by floor, section, worker, status, or room search.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={filters.floor} onChange={(e) => setFilters({ ...filters, floor: e.target.value })} className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-bold dark:border-white/10 dark:bg-white/10">
            <option value="">All floors</option><option value="GROUND">Ground</option><option value="FIRST">First</option>
          </select>
          <input value={filters.section} onChange={(e) => setFilters({ ...filters, section: e.target.value.toUpperCase() })} placeholder="Section" className="w-28 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-bold uppercase dark:border-white/10 dark:bg-white/10" />
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-bold dark:border-white/10 dark:bg-white/10">
            <option value="">All status</option><option>Pending</option><option>In Progress</option><option>Done</option>
          </select>
          <input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Search room" className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-bold dark:border-white/10 dark:bg-white/10" />
          <button className="blue-button"><Search size={17} /> Search</button>
        </div>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {rooms.map((room) => <RoomCard key={room._id} room={room} workers={workers} onAssign={assignRoom} />)}
      </div>
    </div>
  );
}
