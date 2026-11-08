"use client";

import { useState } from "react";
import type { Member, MemberInput, Plan } from "@/types";
import { PLAN_MONTHS, todayISO } from "@/lib/utils";
import { Spinner } from "./States";

interface Props {
  initial?: Member;
  onSubmit: (data: MemberInput) => Promise<void>;
  onCancel: () => void;
}

const field =
  "mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200";

export default function FeeForm({ initial, onSubmit, onCancel }: Props) {
  const [data, setData] = useState<MemberInput>({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    activity: initial?.activity ?? "Musculación",
    plan: initial?.plan ?? "Mensual",
    amount: initial?.amount ?? 28000,
    dueDate: initial?.dueDate ?? todayISO(),
  });
  const [errors, setErrors] = useState<Partial<Record<keyof MemberInput, string>>>({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = <K extends keyof MemberInput>(k: K, v: MemberInput[K]) => setData((d) => ({ ...d, [k]: v }));

  function validate() {
    const e: typeof errors = {};
    if (data.name.trim().length < 3) e.name = "Ingresá nombre y apellido.";
    if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Email inválido.";
    if (data.phone.trim().length < 6) e.phone = "Teléfono inválido.";
    if (!(data.amount > 0)) e.amount = "El importe debe ser mayor a 0.";
    if (!data.dueDate) e.dueDate = "Elegí una fecha.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setServerError(null);
    try {
      await onSubmit({ ...data, name: data.name.trim() });
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setSaving(false);
    }
  }

  const err = (k: keyof MemberInput) => (errors[k] ? <p className="mt-1 text-xs text-rose-600">{errors[k]}</p> : null);
  const border = (k: keyof MemberInput) => (errors[k] ? "border-rose-400" : "border-slate-300 focus:border-indigo-500");

  return (
    <form onSubmit={submit} noValidate className="space-y-5 rounded-xl border border-slate-200 bg-white p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
          Nombre completo
          <input value={data.name} onChange={(e) => set("name", e.target.value)} className={`${field} ${border("name")}`} />
          {err("name")}
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} className={`${field} ${border("email")}`} />
          {err("email")}
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Teléfono
          <input value={data.phone} onChange={(e) => set("phone", e.target.value)} className={`${field} ${border("phone")}`} />
          {err("phone")}
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Actividad
          <select value={data.activity} onChange={(e) => set("activity", e.target.value)} className={`${field} border-slate-300`}>
            {["Musculación", "Crossfit", "Natación", "Yoga", "Pilates", "Spinning"].map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Plan
          <select value={data.plan} onChange={(e) => set("plan", e.target.value as Plan)} className={`${field} border-slate-300`}>
            {(Object.keys(PLAN_MONTHS) as Plan[]).map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Importe (ARS)
          <input type="number" min={0} value={data.amount} onChange={(e) => set("amount", Number(e.target.value))} className={`${field} ${border("amount")}`} />
          {err("amount")}
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Próximo vencimiento
          <input type="date" value={data.dueDate} onChange={(e) => set("dueDate", e.target.value)} className={`${field} ${border("dueDate")}`} />
          {err("dueDate")}
        </label>
      </div>

      {serverError && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{serverError}</p>}

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancelar</button>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
          {saving && <Spinner />}
          {initial ? "Guardar cambios" : "Registrar socio"}
        </button>
      </div>
    </form>
  );
}
