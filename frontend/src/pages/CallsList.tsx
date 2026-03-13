import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { callsApi } from "../services/api";
import type { Call } from "../types";
import StatusBadge from "../components/StatusBadge";

export default function CallsList() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await callsApi.list(filter || undefined);
        setCalls(res.data);
      } catch (err) {
        console.error("Failed to load calls:", err);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    load();
  }, [filter]);

  const formatDuration = (call: Call) => {
    if (!call.ended_at) return "—";
    const ms =
      new Date(call.ended_at).getTime() - new Date(call.started_at).getTime();
    const s = Math.round(ms / 1000);
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">All Calls</h2>
          <p className="text-slate-500 mt-1">
            {calls.length} {calls.length === 1 ? "call" : "calls"} total
          </p>
        </div>

        <div className="flex gap-2">
          {["", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f === "" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
          </div>
        ) : calls.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No calls found.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 uppercase border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3">ID</th>
                <th className="text-left px-6 py-3">Phone Number</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Resolved</th>
                <th className="text-left px-6 py-3">Duration</th>
                <th className="text-left px-6 py-3">Started</th>
                <th className="text-left px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {calls.map((call) => (
                <tr
                  key={call.id}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-3 text-sm text-slate-500">
                    #{call.id}
                  </td>
                  <td className="px-6 py-3 font-mono text-sm font-medium">
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
                    {formatDuration(call)}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-500">
                    {new Date(call.started_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-3">
                    <Link
                      to={`/calls/${call.id}`}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Details
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
