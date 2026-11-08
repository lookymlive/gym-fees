"use client";

import { useState } from "react";
import type { Channel, Member } from "@/types";
import { buildReminderMessage, dueLabel } from "@/lib/utils";
import { Spinner } from "./States";

interface Props {
  member: Member;
  onClose: () => void;
  onSend: (channel: Channel, message: string) => Promise<void>;
}

export default function ReminderModal({ member, onClose, onSend }: Props) {
  const [channel, setChannel] = useState<Channel>("WhatsApp");
  const [message, setMessage] = useState(() => buildReminderMessage(member));
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setSending(true);
    setError(null);
    try {
      await onSend(channel, message);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-900/50 p-0 sm:place-items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Recordatorio simulado</h3>
            <p className="mx-auto mt-1 max-w-xs text-sm text-slate-500">
              Quedó registrado en el historial de {member.name.split(" ")[0]}. No se envió ningún mensaje real ni se realizó ningún cobro.
            </p>
            <button onClick={onClose} className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-slate-900">Recordatorio a {member.name}</h3>
            <p className="text-sm text-slate-500">{dueLabel(member.dueDate)}</p>

            <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200">
              Simulación: no se envía nada real y <strong>no existen cobros automáticos</strong>. El pago siempre se registra manualmente.
            </div>

            <div className="mt-4 flex gap-2">
              {(["WhatsApp", "Email"] as Channel[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setChannel(c)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ring-1 ring-inset ${
                    channel === c ? "bg-indigo-50 text-indigo-700 ring-indigo-300" : "text-slate-600 ring-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="mt-3 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />

            {error && <p role="alert" className="mt-2 text-sm text-rose-600">{error}</p>}

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                Cancelar
              </button>
              <button
                onClick={send}
                disabled={sending || !message.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {sending && <Spinner />}
                Enviar recordatorio (simulado)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
