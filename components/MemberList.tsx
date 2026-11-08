"use client";

import { useMemo, useState } from "react";
import type { FeeStatus, Member } from "@/types";
import { dueLabel, formatARS, getStatus, initials } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { EmptyState } from "./States";

type Filter = "todas" | FeeStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "por_vencer", label: "Por vencer" },
  { id: "vencida", label: "Vencidas" },
  { id: "al_dia", label: "Al día" },
];

interface Props {
  members: Member[];
  onOpen: (id: string) => void;
  onRemind: (m: Member) => void;
  onCreate: () => void;
}

export default function MemberList({ members, onOpen, onRemind, onCreate }: Props) {
  const [filter, setFilter] = useState<Filter>("todas");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const c = { al_dia: 0, por_vencer: 0, vencida: 0 };
    members.forEach((m) => c[getStatus(m.dueDate)]++);
    return c;
  }, [members]);

  const pending = useMemo(
    () => members.filter((m) => getStatus(m.dueDate) !== "al_dia").reduce((a, m) => a + m.amount, 0),
    [members]
  );

  const rows = useMemo(
    () =>
      members
        .filter((m) => (filter === "todas" ? true : getStatus(m.dueDate) === filter))
        .filter((m) => `${m.name} ${m.activity}`.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [members, filter, q]
  );

  if (members.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay socios"
        description="Cargá tu primer socio para empezar a seguir sus cuotas y enviar recordatorios."
        action={{ label: "Agregar socio", onClick: onCreate }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Kpi label="Al día" value={counts.al_dia} tone="text-emerald-600" />
        <Kpi label="Por vencer (7 días)" value={counts.por_vencer} tone="text-amber-600" />
        <Kpi label="Vencidas" value={counts.vencida} tone="text-rose-600" sub={`${formatARS(pending)} pendientes`} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition ${
                filter === f.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar socio o actividad…"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:w-64"
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState title="Sin resultados" description="Probá con otro filtro o término de búsqueda." />
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {rows.map((m) => {
            const s = getStatus(m.dueDate);
            return (
              <li key={m.id} className="flex flex-wrap items-center gap-3 p-4 hover:bg-slate-50/60">
                <button onClick={() => onOpen(m.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                    {initials(m.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-900">{m.name}</span>
                    <span className="block truncate text-xs text-slate-500">
                      {m.activity} · {m.plan} · {formatARS(m.amount)}
                    </span>
                  </span>
                </button>
                <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                  <div className="text-right">
                    <StatusBadge status={s} />
                    <p className="mt-1 text-xs text-slate-500">{dueLabel(m.dueDate)}</p>
                  </div>
                  {s !== "al_dia" && (
                    <button
                      onClick={() => onRemind(m)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white"
                    >
                      Recordar
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Kpi({ label, value, tone, sub }: { label: string; value: number; tone: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-3xl font-semibold ${tone}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
