import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Phone } from "lucide-react";
import { callsApi } from "../services/api";
import type { CallDetail } from "../types";

export default function UnresolvedQueries() {
  const [calls, setCalls] = useState<CallDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await callsApi.unresolved();
        setCalls(res.data);
      } catch (err) {
        console.error("Failed to load unresolved calls:", err);
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Unresolved Queries
        </h2>
        <p className="text-slate-500 mt-1">
          Messages the AI couldn&apos;t confidently answer
        </p>
      </div>

      {calls.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <AlertTriangle className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="text-slate-500 text-lg">No unresolved queries</p>
          <p className="text-slate-400 text-sm mt-1">
            All customer questions have been matched to support scripts.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {calls.map((call) => {
            const unresolvedMsgs = call.messages.filter(
              (m) => m.is_unresolved,
            );
            return (
              <div
                key={call.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-slate-400" />
                    <span className="font-mono font-medium text-slate-800">
                      {call.phone_number}
                    </span>
                    <span className="text-sm text-slate-500">
                      Call #{call.id}
                    </span>
                  </div>
                  <Link
                    to={`/calls/${call.id}`}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    View Full Call
                  </Link>
                </div>

                <div className="p-6 space-y-3">
                  {unresolvedMsgs.map((msg) => {
                    const customerBefore = call.messages.find(
                      (m) =>
                        m.role === "customer" &&
                        new Date(m.timestamp) <= new Date(msg.timestamp) &&
                        m.id !== msg.id,
                    );

                    return (
                      <div
                        key={msg.id}
                        className="border border-amber-200 bg-amber-50 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle
                            size={16}
                            className="text-amber-500 mt-0.5 shrink-0"
                          />
                          <div className="flex-1">
                            {customerBefore && (
                              <p className="text-sm text-slate-600 mb-2">
                                <span className="font-semibold">Customer:</span>{" "}
                                &quot;{customerBefore.content}&quot;
                              </p>
                            )}
                            <p className="text-sm text-amber-800">
                              <span className="font-semibold">
                                AI Response (unresolved):
                              </span>{" "}
                              &quot;{msg.content}&quot;
                            </p>
                            <p className="text-xs text-slate-400 mt-2">
                              {new Date(msg.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
