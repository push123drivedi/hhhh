import { motion } from "framer-motion";

export default function StatCard({ label, value, icon: Icon, accent = "orange", helper }) {
  const styles = {
    orange: "bg-orange-500/12 text-svmsOrange",
    blue: "bg-blue-500/12 text-sky-700 dark:text-sky-300",
    green: "bg-emerald-500/12 text-emerald-600",
    red: "bg-red-500/12 text-red-600"
  };

  return (
    <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="panel svms-card-watermark p-5">
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-300">{label}</p>
          <p className="mt-2 text-4xl font-black tracking-tight">{value ?? 0}</p>
          {helper && <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{helper}</p>}
        </div>
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${styles[accent]}`}>
          <Icon size={22} />
        </span>
      </div>
    </motion.article>
  );
}
