import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Phone,
  PhoneCall,
  AlertTriangle,
  FileText,
} from "lucide-react";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/calls", icon: Phone, label: "Calls" },
  { to: "/call", icon: PhoneCall, label: "New Call" },
  { to: "/unresolved", icon: AlertTriangle, label: "Unresolved" },
  { to: "/scripts", icon: FileText, label: "Scripts" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-emerald-400">Net</span>Connect
        </h1>
        <p className="text-xs text-slate-400 mt-1">Call Center</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
        NetConnect Support v1.0
      </div>
    </aside>
  );
}
