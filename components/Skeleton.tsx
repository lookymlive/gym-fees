export function KpiSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="status" aria-label="Cargando KPIs">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 animate-pulse">
          <div className="h-3 w-1/2 rounded bg-slate-200 mb-2" />
          <div className="h-6 w-3/4 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white" role="status" aria-label="Cargando filas">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className={`animate-pulse rounded bg-slate-200 ${
                j === 0 ? "size-10" : j === 1 ? "h-3 w-24" : "h-3 w-20"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 animate-pulse space-y-3" role="status" aria-label="Cargando tarjeta">
      <div className="h-4 w-1/4 rounded bg-slate-200" />
      <div className="h-8 w-1/2 rounded bg-slate-200" />
      <div className="h-3 w-full rounded bg-slate-200" />
      <div className="h-3 w-2/3 rounded bg-slate-200" />
    </div>
  );
}

export function FormFieldSkeleton({ label = true, input = true }: { label?: boolean; input?: boolean }) {
  return (
    <div className="space-y-1.5 animate-pulse">
      {label && <div className="h-3 w-1/3 rounded bg-slate-200" />}
      {input && <div className="h-9 w-full rounded border border-slate-200 bg-slate-50" />}
    </div>
  );
}

export function ModalSkeleton() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 animate-pulse" role="status" aria-label="Cargando modal">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 space-y-4">
        <div className="h-5 w-1/3 rounded bg-slate-200" />
        <div className="space-y-3">
          <FormFieldSkeleton />
          <FormFieldSkeleton />
          <FormFieldSkeleton />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <div className="h-9 w-20 rounded bg-slate-200" />
          <div className="h-9 w-24 rounded bg-slate-300" />
        </div>
      </div>
    </div>
  );
}

export function AvatarSkeleton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "size-8", md: "size-10", lg: "size-14" };
  return <div className={`${sizes[size]} animate-pulse rounded-full bg-slate-200`} aria-hidden="true" />;
}

export function BadgeSkeleton() {
  return <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200" aria-hidden="true" />;
}