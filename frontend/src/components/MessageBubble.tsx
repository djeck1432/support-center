import { AlertTriangle } from "lucide-react";
import type { CallMessage } from "../types";

interface MessageBubbleProps {
  message: CallMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isCustomer = message.role === "customer";

  return (
    <div className={`flex ${isCustomer ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isCustomer
            ? "bg-emerald-600 text-white rounded-br-md"
            : "bg-slate-100 text-slate-800 rounded-bl-md"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold opacity-75 uppercase">
            {message.role}
          </span>
          {message.is_unresolved && (
            <AlertTriangle size={12} className="text-amber-500" />
          )}
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <p className={`text-[10px] mt-1 ${isCustomer ? "text-emerald-200" : "text-slate-400"}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
