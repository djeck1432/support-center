interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const colors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  completed: "bg-slate-100 text-slate-700",
  missed: "bg-red-100 text-red-700",
  resolved: "bg-emerald-100 text-emerald-700",
  unresolved: "bg-amber-100 text-amber-700",
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const base = colors[status] ?? "bg-gray-100 text-gray-700";
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span className={`inline-flex items-center rounded-full font-medium capitalize ${base} ${sizeClass}`}>
      {status}
    </span>
  );
}
