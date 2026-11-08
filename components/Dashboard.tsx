"use client";

import { useCallback, useEffect, useState } from "react";
import type { Channel, Member, MemberInput, Scenario, View } from "@/types";
import { fetchMembers, registerPayment, saveMember, sendReminder } from "@/lib/api";
import Sidebar from "./Sidebar";
import MemberList from "./MemberList";
import MemberDetail from "./MemberDetail";
import FeeForm from "./FeeForm";
import ReminderModal from "./ReminderModal";
import { DetailSkeleton, ErrorState, ListSkeleton } from "./States";

export default function Dashboard() {
  const [scenario, setScenario] = useState<Scenario>("normal");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>({ name: "list" });
  const [remindTarget, setRemindTarget] = useState<Member | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async (s: Scenario) => {
    setLoading(true);
    setError(null);
    try {
      setMembers(await fetchMembers(s));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(scenario);
  }, [scenario, load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const upsert = (m: Member) =>
    setMembers((prev) => (prev.some((x) => x.id === m.id) ? prev.map((x) => (x.id === m.id ? m : x)) : [m, ...prev]));

  const current = view.name === "detail" || (view.name === "form" && view.id)
    ? members.find((m) => m.id === (view as { id: string }).id)
    : undefined;

  async function handleSave(data: MemberInput) {
    const id = view.name === "form" ? view.id : undefined;
    const saved = await saveMember(data, id);
    upsert(saved);
    setToast(id ? "Cambios guardados" : "Socio registrado");
    setView({ name: "detail", id: saved.id });
  }

  async function handleSend(channel: Channel, message: string) {
    if (!remindTarget) return;
    upsert(await sendReminder(remindTarget.id, channel, message));
  }

  async function handlePay(id: string) {
    try {
      upsert(await registerPayment(id));
      setToast("Pago registrado manualmente");
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Error al registrar el pago");
    }
  }

  const title =
    view.name === "list" ? "Socios y cuotas" : view.name === "detail" ? "Detalle del socio" : view.id ? "Editar socio" : "Nuevo socio";

  function body() {
    if (loading) return view.name === "detail" ? <DetailSkeleton /> : <ListSkeleton />;
    if (error) return <ErrorState message={error} onRetry={() => load(scenario)} />;

    if (view.name === "list")
      return (
        <MemberList
          members={members}
          onOpen={(id) => setView({ name: "detail", id })}
          onRemind={setRemindTarget}
          onCreate={() => setView({ name: "form" })}
        />
      );

    if (view.name === "detail")
      return current ? (
        <MemberDetail
          member={current}
          onBack={() => setView({ name: "list" })}
          onEdit={() => setView({ name: "form", id: current.id })}
          onRemind={() => setRemindTarget(current)}
          onPay={() => handlePay(current.id)}
        />
      ) : (
        <ErrorState message="No se encontró el socio." onRetry={() => setView({ name: "list" })} />
      );

    return (
      <div className="mx-auto max-w-2xl">
        <FeeForm
          key={view.id ?? "new"}
          initial={current}
          onSubmit={handleSave}
          onCancel={() => setView(view.id ? { name: "detail", id: view.id } : { name: "list" })}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        active={view.name === "form" ? "form" : "list"}
        scenario={scenario}
        onScenario={(s) => {
          setScenario(s);
          setView({ name: "list" });
        }}
        onNavigate={(v) => setView(v === "list" ? { name: "list" } : { name: "form" })}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8">
          <button onClick={() => setMenuOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden" aria-label="Abrir menú">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
          <h1 className="flex-1 text-lg font-semibold">{title}</h1>
          {view.name === "list" && !loading && !error && members.length > 0 && (
            <button onClick={() => setView({ name: "form" })} className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              + Nuevo socio
            </button>
          )}
        </header>

        <main className="flex-1 p-4 md:p-8">{body()}</main>
      </div>

      {remindTarget && <ReminderModal member={remindTarget} onClose={() => setRemindTarget(null)} onSend={handleSend} />}

      {toast && (
        <div role="status" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
