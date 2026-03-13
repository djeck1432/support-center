import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  PhoneCall,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { callsApi } from "../services/api";
import type { DashboardStats, Call } from "../types";
import StatusBadge from "../components/StatusBadge";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, callsRes] = await Promise.all([
          callsApi.dashboard(),
          callsApi.list(),
        ]);
        setStats(statsRes.data);
        setRecentCalls(callsRes.data.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}m ${s}s`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 mt-1">Call center overview</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Calls Today"
            value={stats.total_calls_today}
            icon={Phone}
            color="bg-blue-500"
          />
          <StatCard
            label="Active Calls"
            value={stats.active_calls}
            icon={PhoneCall}
            color="bg-emerald-500"
          />
          <StatCard
            label="Completed"
            value={stats.completed_calls}
            icon={CheckCircle}
            color="bg-slate-500"
          />
          <StatCard
            label="Avg Duration"
            value={formatDuration(stats.avg_duration_seconds)}
            icon={Clock}
            color="bg-violet-500"
          />
        </div>
      )}

      {stats && stats.unresolved_count > 0 && (
        <Link
          to="/unresolved"
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition-colors"
        >
          <AlertTriangle className="text-amber-500" size={20} />
          <span className="text-amber-800 font-medium">
            {stats.unresolved_count} unresolved{" "}
            {stats.unresolved_count === 1 ? "query" : "queries"} need attention
          </span>
        </Link>
      )}

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Recent Calls</h3>
        </div>
        {recentCalls.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No calls yet. Start a new call to see activity here.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 uppercase border-b border-slate-100">
                <th className="text-left px-6 py-3">Phone Number</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Resolved</th>
                <th className="text-left px-6 py-3">Started</th>
                <th className="text-left px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call) => (
                <tr
                  key={call.id}
                  className="border-b border-slate-50 hover:bg-slate-50"
                >
                  <td className="px-6 py-3 font-mono text-sm">
                    {call.phone_number}
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge status={call.status} />
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge
                      status={call.is_resolved ? "resolved" : "unresolved"}
                    />
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-500">
                    {new Date(call.started_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-3">
                    <Link
                      to={`/calls/${call.id}`}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
