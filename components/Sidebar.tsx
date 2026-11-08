"use client";

import type { Scenario } from "@/types";

const SCENARIOS: { value: Scenario; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "lento", label: "Carga lenta" },
  { value: "vacio", label: "Sin socios" },
  { value: "error", label: "Error de red" },
];

interface Props {
  active: "list" | "form";
  scenario: Scenario;
  onScenario: (s: Scenario) => void;
  onNavigate: (v: "list" | "form") => void;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ active, scenario, onScenario, onNavigate, open, onClose }: Props) {
  const nav = [
    { id: "list" as const, label: "Socios y cuotas" },
    { id: "form" as const, label: "Nuevo socio" },
  ];
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/40 md:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5">
          <div className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">C</div>
          <span className="font-semibold text-slate-900">CuotaClub</span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                onNavigate(n.id);
                onClose();
              }}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                active === n.id ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <label htmlFor="scenario" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Simulador de estados
          </label>
          <select
            id="scenario"
            value={scenario}
            onChange={(e) => onScenario(e.target.value as Scenario)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            {SCENARIOS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-400">Demo: los datos son ficticios y no hay cobros automáticos.</p>
        </div>
      </aside>
    </>
  );
}
