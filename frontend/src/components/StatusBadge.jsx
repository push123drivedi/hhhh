export default function StatusBadge({ status }) {
  const tone = {
    Pending: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-200",
    "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200",
    Done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
    "Not Done": "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200"
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-black ${tone[status] || tone.Pending}`}>{status}</span>;
}
