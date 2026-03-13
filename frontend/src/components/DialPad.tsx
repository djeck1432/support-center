import { Delete } from "lucide-react";

interface DialPadProps {
  value: string;
  onChange: (value: string) => void;
}

const keys = [
  "1", "2", "3",
  "4", "5", "6",
  "7", "8", "9",
  "*", "0", "#",
];

export default function DialPad({ value, onChange }: DialPadProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter phone number"
          className="w-full text-center text-2xl font-mono tracking-widest py-4 px-4 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {value && (
          <button
            onClick={() => onChange(value.slice(0, -1))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <Delete size={20} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => onChange(value + key)}
            className="h-14 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-xl font-medium text-slate-700 transition-colors"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
