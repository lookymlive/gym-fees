import type { FeeStatus } from "@/types";

const STYLES: Record<FeeStatus, { label: string; cls: string; dot: string }> = {
  al_dia: { label: "Al día", cls: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" },
  por_vencer: { label: "Por vencer", cls: "bg-amber-50 text-amber-800 ring-amber-600/25", dot: "bg-amber-500" },
  vencida: { label: "Vencida", cls: "bg-rose-50 text-rose-700 ring-rose-600/20", dot: "bg-rose-500" },
};

export default function StatusBadge({ status }: { status: FeeStatus }) {
  const s = STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${s.cls}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
