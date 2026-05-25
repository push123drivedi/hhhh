import { ChartPie } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../services/api";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data));
  }, []);

  return (
    <div className="space-y-5">
      <div className="panel p-5">
        <h2 className="flex items-center gap-2 text-2xl font-black"><ChartPie size={24} /> Analytics</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-300">Cleaning time analytics, room-type progress, and worker output.</p>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="panel p-5">
          <h3 className="mb-4 font-black">Room Type Completion</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.roomTypeAnalytics || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="type" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#0b2447" radius={[8, 8, 0, 0]} />
                <Bar dataKey="done" fill="#f47721" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel p-5">
          <h3 className="mb-4 font-black">Cleaning Minutes by Worker</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.workerPerformance || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="minutes" stroke="#f47721" strokeWidth={4} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
