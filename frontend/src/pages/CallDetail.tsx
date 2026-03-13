import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, Clock, AlertTriangle } from "lucide-react";
import { callsApi } from "../services/api";
import type { CallDetail as CallDetailType } from "../types";
import StatusBadge from "../components/StatusBadge";
import MessageBubble from "../components/MessageBubble";

export default function CallDetail() {
  const { id } = useParams<{ id: string }>();
  const [call, setCall] = useState<CallDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const res = await callsApi.get(Number(id));
        setCall(res.data);
      } catch (err) {
        console.error("Failed to load call:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!call) {
    return (
      <div className="text-center py-12 text-slate-500">Call not found.</div>
    );
  }

  const formatDuration = () => {
    if (!call.ended_at) return "Ongoing";
    const ms =
      new Date(call.ended_at).getTime() - new Date(call.started_at).getTime();
    const s = Math.round(ms / 1000);
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  };

  const unresolvedCount = call.messages.filter((m) => m.is_unresolved).length;

  return (
    <div className="space-y-6">
      <Link
        to="/calls"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={16} />
        Back to calls
      </Link>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Call #{call.id}
            </h2>
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Phone size={14} />
                <span className="font-mono font-medium text-slate-700">
                  {call.phone_number}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {formatDuration()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={call.status} size="md" />
            <StatusBadge
              status={call.is_resolved ? "resolved" : "unresolved"}
              size="md"
            />
          </div>
        </div>

        <div className="flex gap-6 mt-4 text-sm text-slate-500">
          <span>
            Started:{" "}
            <span className="text-slate-700">
              {new Date(call.started_at).toLocaleString()}
            </span>
          </span>
          {call.ended_at && (
            <span>
              Ended:{" "}
              <span className="text-slate-700">
                {new Date(call.ended_at).toLocaleString()}
              </span>
            </span>
          )}
        </div>
      </div>

      {unresolvedCount > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertTriangle className="text-amber-500" size={20} />
          <span className="text-amber-800 font-medium">
            {unresolvedCount} unresolved{" "}
            {unresolvedCount === 1 ? "message" : "messages"} in this call
          </span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Transcript
        </h3>
        {call.messages.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No messages.</p>
        ) : (
          <div className="space-y-1">
            {call.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
