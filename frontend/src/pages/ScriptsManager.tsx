import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Save, FileText } from "lucide-react";
import { scriptsApi } from "../services/api";
import type { SupportScript } from "../types";

export default function ScriptsManager() {
  const [scripts, setScripts] = useState<SupportScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await scriptsApi.list();
        setScripts(res.data);
      } catch (err) {
        console.error("Failed to load scripts:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
    setEditingId(null);
  };

  const startEdit = (script: SupportScript) => {
    setEditingId(script.id);
    setEditText(script.script_text);
  };

  const saveEdit = async (id: number) => {
    setSaving(true);
    try {
      const res = await scriptsApi.update(id, { script_text: editText });
      setScripts((prev) =>
        prev.map((s) => (s.id === id ? res.data : s)),
      );
      setEditingId(null);
    } catch (err) {
      console.error("Failed to save script:", err);
    } finally {
      setSaving(false);
    }
  };

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
        <h2 className="text-2xl font-bold text-slate-800">Support Scripts</h2>
        <p className="text-slate-500 mt-1">
          {scripts.length} scripts for AI-powered customer support
        </p>
      </div>

      <div className="space-y-3">
        {scripts.map((script) => {
          const isExpanded = expandedId === script.id;
          const isEditing = editingId === script.id;

          return (
            <div
              key={script.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(script.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-emerald-500" />
                  <div>
                    <p className="font-semibold text-slate-800">
                      {script.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Category: {script.category} &middot; Keywords:{" "}
                      {script.keywords.split(",").slice(0, 3).join(", ")}
                      ...
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp size={18} className="text-slate-400" />
                ) : (
                  <ChevronDown size={18} className="text-slate-400" />
                )}
              </button>

              {isExpanded && (
                <div className="px-6 pb-4 border-t border-slate-100">
                  {isEditing ? (
                    <div className="mt-4 space-y-3">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={20}
                        className="w-full p-3 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(script.id)}
                          disabled={saving}
                          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Save size={14} />
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <pre className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                        {script.script_text}
                      </pre>
                      <button
                        onClick={() => startEdit(script)}
                        className="mt-3 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                      >
                        Edit Script
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
