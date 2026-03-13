import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneCall, PhoneOff, Volume2, Loader2 } from "lucide-react";
import { callsApi } from "../services/api";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import DialPad from "../components/DialPad";
import type { Call, AIResponse } from "../types";

interface ChatEntry {
  role: "customer" | "ai";
  text: string;
  meta?: AIResponse;
}

export default function CallInterface() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [chatLog, setChatLog] = useState<ChatEntry[]>([]);
  const [textInput, setTextInput] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<{ role: string; content: string }[]>([]);

  const { speak, isSpeaking } = useSpeechSynthesis();

  const sendToBackend = useCallback(
    async (text: string) => {
      if (!activeCall || sending) return;
      setSending(true);
      setChatLog((prev) => [...prev, { role: "customer", text }]);
      historyRef.current.push({ role: "user", content: text });

      try {
        const res = await callsApi.sendMessage(
          activeCall.id,
          text,
          historyRef.current.slice(0, -1),
        );
        const ai = res.data;
        setChatLog((prev) => [
          ...prev,
          { role: "ai", text: ai.response, meta: ai },
        ]);
        historyRef.current.push({ role: "assistant", content: ai.response });
        speak(ai.response);
      } catch (err) {
        console.error("Failed to send message:", err);
        setChatLog((prev) => [
          ...prev,
          {
            role: "ai",
            text: "Sorry, something went wrong. Please try again.",
            meta: { response: "", confidence: 0, is_unresolved: true, matched_script_id: null, matched_script_title: null },
          },
        ]);
      } finally {
        setSending(false);
      }
    },
    [activeCall, sending, speak],
  );

  const handleSpeechResult = useCallback(
    (text: string) => {
      sendToBackend(text);
    },
    [sendToBackend],
  );

  const {
    isListening,
    interimTranscript,
    startListening,
    stopListening,
    supported: sttSupported,
  } = useSpeechRecognition(handleSpeechResult);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const startCall = async () => {
    if (!phoneNumber.trim()) return;
    try {
      const res = await callsApi.create(phoneNumber.trim());
      setActiveCall(res.data);
      setChatLog([]);
      historyRef.current = [];
    } catch (err) {
      console.error("Failed to start call:", err);
    }
  };

  const endCall = async () => {
    if (!activeCall) return;
    stopListening();
    try {
      await callsApi.end(activeCall.id);
    } catch (err) {
      console.error("Failed to end call:", err);
    }
    setActiveCall(null);
  };

  const sendTextManually = () => {
    const text = textInput.trim();
    if (!text || !activeCall || sending) return;
    sendToBackend(text);
    setTextInput("");
  };

  if (!activeCall) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">New Call</h2>
          <p className="text-slate-500 mt-1">
            Enter a phone number to start a call
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <DialPad value={phoneNumber} onChange={setPhoneNumber} />
          <button
            onClick={startCall}
            disabled={!phoneNumber.trim()}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium py-3 rounded-xl transition-colors"
          >
            <PhoneCall size={20} />
            Call
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono font-medium text-slate-800">
              {activeCall.phone_number}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Call #{activeCall.id} &middot; Connected
          </p>
        </div>
        <button
          onClick={endCall}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <PhoneOff size={16} />
          End Call
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 h-[400px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatLog.length === 0 && (
            <p className="text-center text-slate-400 mt-16">
              {sttSupported
                ? "Click the microphone to start speaking, or type below."
                : "Type your message below to simulate the call."}
            </p>
          )}
          {chatLog.map((entry, i) => (
            <div
              key={i}
              className={`flex ${entry.role === "customer" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  entry.role === "customer"
                    ? "bg-emerald-600 text-white rounded-br-md"
                    : "bg-slate-100 text-slate-800 rounded-bl-md"
                }`}
              >
                <p className="text-xs font-semibold opacity-70 uppercase mb-1">
                  {entry.role}
                </p>
                <p className="text-sm leading-relaxed">{entry.text}</p>
                {entry.meta?.is_unresolved && (
                  <p className="text-xs mt-1 text-amber-600 font-medium">
                    Unresolved -- flagged for review
                  </p>
                )}
                {entry.meta?.matched_script_title && (
                  <p className="text-xs mt-1 opacity-60">
                    Script: {entry.meta.matched_script_title} (
                    {Math.round((entry.meta.confidence ?? 0) * 100)}%)
                  </p>
                )}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-2.5 bg-slate-100 text-slate-500 rounded-bl-md">
                <Loader2 size={16} className="animate-spin inline mr-2" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}
          {interimTranscript && (
            <div className="flex justify-end">
              <div className="max-w-[75%] rounded-2xl px-4 py-2.5 bg-emerald-100 text-emerald-700 rounded-br-md italic text-sm">
                {interimTranscript}...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="border-t border-slate-100 p-3 flex items-center gap-2">
          {sttSupported && (
            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-2.5 rounded-lg transition-colors ${
                isListening
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              title={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}
          {isSpeaking && (
            <Volume2 size={18} className="text-emerald-500 animate-pulse" />
          )}
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendTextManually()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={sendTextManually}
            disabled={!textInput.trim() || sending}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
