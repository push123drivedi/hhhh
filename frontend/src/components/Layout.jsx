import { BarChart3, Bell, Building2, ChartPie, ClipboardList, Layers3, LogOut, Moon, School, Sun, UsersRound } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/floors", label: "Floors", icon: Building2 },
  { to: "/sections", label: "Sections", icon: Layers3 },
  { to: "/rooms", label: "Rooms", icon: ClipboardList },
  { to: "/workers", label: "Workers", icon: UsersRound },
  { to: "/reports", label: "Reports", icon: ChartPie },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/notifications", label: "Alerts", icon: Bell }
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();

  return (
    <div className="svms-watermark min-h-screen text-svmsBlue dark:text-white">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/70 bg-white/80 px-4 py-5 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-svmsBlue/80 lg:block">
        <div className="mb-7 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-white/10">
          <img src="/svms-logo.png" alt="St. Vivekanand Millennium School" className="h-12 w-44 object-contain" />
        </div>
        <nav className="space-y-1.5">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-extrabold transition ${
                  isActive
                    ? "bg-svmsOrange text-white shadow-lg shadow-orange-500/25"
                    : "text-slate-600 hover:bg-white hover:text-svmsBlue dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="relative z-10 lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/70 bg-white/74 px-4 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-svmsBlue/75 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-svmsBlue text-white dark:bg-svmsOrange">
                <School size={22} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-black uppercase tracking-wide text-svmsOrange">St. Vivekanand Millennium School</p>
                <h1 className="truncate text-lg font-black sm:text-2xl">AI Staff Duty Command Center</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="icon-button" title="Theme" onClick={() => setDark(!dark)}>
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-black">{user?.name}</p>
                <p className="text-xs capitalize text-slate-500 dark:text-slate-300">{user?.role}</p>
              </div>
              <button className="icon-button" title="Logout" onClick={logout}>
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className="fixed bottom-0 left-0 right-0 z-20 grid grid-cols-4 border-t border-white/70 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-svmsBlue/95 lg:hidden">
          {links.slice(0, 4).map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `grid place-items-center gap-1 py-2 text-xs font-bold ${isActive ? "text-svmsOrange" : "text-slate-500 dark:text-slate-300"}`}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>

        <section className="px-4 py-5 pb-24 sm:px-6 lg:pb-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
