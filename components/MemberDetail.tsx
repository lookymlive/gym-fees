"use client";

import { useState } from "react";
import type { Member } from "@/types";
import { dueLabel, formatARS, formatDate, formatDateTime, getStatus, initials } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { Spinner } from "./States";

interface Props {
  member: Member;
  onBack: () => void;
  onEdit: () => void;
  onRemind: () => void;
  onPay: () => Promise<void>;
}

export default function MemberDetail({ member: m, onBack, onEdit, onRemind, onPay }: Props) {
  const [paying, setPaying] = useState(false);
  const status = getStatus(m.dueDate);
  const hasReminder = m.reminders.length > 0;

  const steps = [
    { label: "Cuota próxima a vencer", detail: dueLabel(m.dueDate), done: status !== "al_dia" },
    { label: "Recordatorio (simulado)", detail: hasReminder ? `Enviado ${formatDateTime(m.reminders[0].sentAt)}` : "Pendiente", done: hasReminder },
    { label: "Pago registrado manualmente", detail: m.lastPaymentDate ? `Último pago: ${formatDate(m.lastPaymentDate)}` : "Sin pagos", done: status === "al_dia" && !!m.lastPaymentDate },
  ];

  async function pay() {
    setPaying(true);
    try {
      await onPay();
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-800">← Volver al listado</button>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700">{initials(m.name)}</span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-slate-900">{m.name}</h2>
            <p className="text-sm text-slate-500">{m.email} · {m.phone}</p>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={status} />
              <span className="text-sm text-slate-500">{dueLabel(m.dueDate)}</span>
            </div>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
          <Item label="Actividad" value={m.activity} />
          <Item label="Plan" value={m.plan} />
          <Item label="Importe" value={formatARS(m.amount)} />
          <Item label="Vencimiento" value={formatDate(m.dueDate)} />
        </dl>

        <div className="mt-5 flex flex-wrap gap-2">
          {status !== "al_dia" && (
            <button onClick={onRemind} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Enviar recordatorio
            </button>
          )}
          <button
            onClick={pay}
            disabled={paying}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {paying && <Spinner />}
            Registrar pago manual
          </button>
          <button onClick={onEdit} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Editar</button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900">Recorrido de la cuota</h3>
        <ol className="mt-4 space-y-4">
          {steps.map((s, i) => (
            <li key={s.label} className="flex gap-3">
              <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${s.done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                {s.done ? "✓" : i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">{s.label}</p>
                <p className="text-xs text-slate-500">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">No hay cobros automáticos: el sistema solo recuerda; el pago lo confirma el staff.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900">Historial de recordatorios</h3>
        {m.reminders.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Todavía no se enviaron recordatorios.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {m.reminders.map((r) => (
              <li key={r.id} className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">{r.channel} · {formatDateTime(r.sentAt)}</p>
                <p className="mt-1 text-sm text-slate-700">{r.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}
