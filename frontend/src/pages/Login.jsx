import { AnimatePresence, motion } from "framer-motion";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login, loading } = useAuth();
  const [form, setForm] = useState({ email: "admin@svms.edu", password: "Admin@123" });
  const [error, setError] = useState("");

  if (user) return <Navigate to="/dashboard" replace />;

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check backend and credentials.");
    }
  }

  return (
    <main className="svms-watermark grid min-h-screen overflow-hidden bg-white text-svmsBlue dark:bg-svmsBlue dark:text-white lg:grid-cols-[1fr_0.85fr]">
      <section className="relative hidden items-end overflow-hidden bg-[linear-gradient(135deg,rgba(11,36,71,.96),rgba(244,119,33,.72)),url('https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1800&auto=format&fit=crop')] bg-cover bg-center p-12 lg:flex">
        <div className="relative z-10 max-w-2xl">
          <img src="/svms-logo.png" alt="St. Vivekanand Millennium School" className="mb-8 h-24 w-96 rounded-2xl bg-white/95 object-contain p-4 shadow-2xl" />
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black text-white backdrop-blur">
            <ShieldCheck size={16} /> AI recommendation + manual verification
          </p>
          <h1 className="text-5xl font-black leading-tight text-white">Smart Group D Duty Management</h1>
          <p className="mt-4 text-lg font-medium text-white/85">Premium live command center for room cleaning status, worker recommendations, and admin-verified completion.</p>
        </div>
      </section>

      <section className="relative z-10 flex items-center justify-center px-5 py-10">
        <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="panel svms-card-watermark w-full max-w-md p-7 sm:p-8">
          <img src="/svms-logo.png" alt="St. Vivekanand Millennium School" className="relative z-10 h-16 w-72 object-contain" />
          <div className="relative z-10">
            <h2 className="mt-7 text-3xl font-black">Admin Login</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-300">Enter SVMS dashboard credentials.</p>

            <label className="mt-6 block text-sm font-black">Email</label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3 dark:border-white/10 dark:bg-white/10">
              <Mail size={18} className="text-svmsOrange" />
              <input className="h-12 flex-1 bg-transparent font-semibold outline-none" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" required />
            </div>

            <label className="mt-4 block text-sm font-black">Password</label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3 dark:border-white/10 dark:bg-white/10">
              <LockKeyhole size={18} className="text-svmsOrange" />
              <input className="h-12 flex-1 bg-transparent font-semibold outline-none" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" required />
            </div>

            <AnimatePresence>{error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-700 dark:bg-red-500/15 dark:text-red-200">{error}</motion.p>}</AnimatePresence>

            <button disabled={loading} className="premium-button mt-6 h-12 w-full disabled:opacity-60">
              {loading ? "Signing in..." : "Open Dashboard"}
            </button>
            <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300">Admin: admin@svms.edu / Admin@123</p>
          </div>
        </motion.form>
      </section>
    </main>
  );
}
