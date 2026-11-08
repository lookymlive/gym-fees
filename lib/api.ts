// API simulada. Reemplazá cada función por llamadas a Supabase cuando quieras persistir.
import type { Channel, Member, MemberInput, Reminder, Scenario } from "@/types";
import { initialMembers } from "@/data/mockData";
import { buildReminderMessage, nextDueDate, todayISO, wait } from "@/lib/utils";

let store: Member[] = structuredClone(initialMembers);
let lastScenario: Scenario = "normal";
let failNext = false; // lo usa el escenario "error" para fallar también al guardar

function sync(s: Scenario) {
  if (s === lastScenario) return;
  store = s === "vacio" ? [] : structuredClone(initialMembers);
  lastScenario = s;
}

export async function fetchMembers(s: Scenario): Promise<Member[]> {
  sync(s);
  failNext = s === "error";
  await wait(s === "lento" ? 3200 : 900);
  if (s === "error") throw new Error("No se pudo conectar con el servidor (error simulado).");
  return structuredClone(store);
}

async function mutate<T>(fn: () => T): Promise<T> {
  await wait(700);
  if (failNext) throw new Error("No se pudo guardar el cambio (error simulado).");
  return fn();
}

export function saveMember(input: MemberInput, id?: string): Promise<Member> {
  return mutate(() => {
    if (id) {
      const i = store.findIndex((x) => x.id === id);
      store[i] = { ...store[i], ...input };
      return structuredClone(store[i]);
    }
    const created: Member = {
      ...input,
      id: `m-${Date.now()}`,
      lastPaymentDate: null,
      reminders: [],
    };
    store = [created, ...store];
    return structuredClone(created);
  });
}

// Pago registrado MANUALMENTE por el staff. No hay cobros automáticos.
export function registerPayment(id: string): Promise<Member> {
  return mutate(() => {
    const i = store.findIndex((x) => x.id === id);
    store[i] = {
      ...store[i],
      lastPaymentDate: todayISO(),
      dueDate: nextDueDate(store[i]),
    };
    return structuredClone(store[i]);
  });
}

// Recordatorio SIMULADO: solo se guarda en el historial, no se envía nada real.
export function sendReminder(id: string, channel: Channel, message?: string): Promise<Member> {
  return mutate(() => {
    const i = store.findIndex((x) => x.id === id);
    const r: Reminder = {
      id: `r-${Date.now()}`,
      sentAt: new Date().toISOString(),
      channel,
      message: message ?? buildReminderMessage(store[i]),
    };
    store[i] = { ...store[i], reminders: [r, ...store[i].reminders] };
    return structuredClone(store[i]);
  });
}
