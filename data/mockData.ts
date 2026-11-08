import type { Member, Plan, Reminder } from "@/types";
import { toISO } from "@/lib/utils";

// Fechas relativas a hoy: la demo nunca queda "vieja".
const d = (days: number) => {
  const t = new Date();
  t.setDate(t.getDate() + days);
  return toISO(t);
};

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, ".");

const rem = (id: string, daysAgo: number, msg: string): Reminder => ({
  id,
  sentAt: new Date(Date.now() - daysAgo * 86_400_000).toISOString(),
  channel: "WhatsApp",
  message: msg,
});

const m = (
  n: number,
  name: string,
  activity: string,
  plan: Plan,
  amount: number,
  due: number,
  paid: number | null,
  reminders: Reminder[] = []
): Member => ({
  id: `m-${n}`,
  name,
  email: `${slug(name)}@mail.com`,
  phone: `+54 9 341 555-${1000 + n * 37}`,
  activity,
  plan,
  amount,
  dueDate: d(due),
  lastPaymentDate: paid === null ? null : d(paid),
  reminders,
});

export const initialMembers: Member[] = [
  // Al día
  m(1, "Lucía Fernández", "Musculación", "Mensual", 28000, 20, -10),
  m(2, "Joaquín Paredes", "Natación", "Trimestral", 72000, 55, -35),
  m(3, "Valentina Ruiz", "Pilates", "Mensual", 32000, 14, -16),
  m(4, "Santiago Molina", "Crossfit", "Anual", 360000, 210, -155),
  m(5, "Agustina Ledesma", "Yoga", "Mensual", 26000, 25, -5),
  // Por vencer (≤ 7 días)
  m(6, "Martín Giménez", "Crossfit", "Mensual", 35000, 2, -28, [
    rem("r-1", 1, "Hola Martín! Te recordamos que tu cuota mensual de Crossfit vence pronto."),
  ]),
  m(7, "Camila Rossi", "Natación", "Mensual", 30000, 0, -30),
  m(8, "Tomás Acosta", "Musculación", "Trimestral", 78000, 5, -85),
  m(9, "Florencia Benítez", "Spinning", "Mensual", 29000, 7, -23),
  // Vencidas
  m(10, "Nicolás Herrera", "Musculación", "Mensual", 28000, -3, -33, [
    rem("r-2", 6, "Hola Nicolás! Tu cuota de Musculación vence en unos días."),
  ]),
  m(11, "Julieta Sosa", "Yoga", "Mensual", 26000, -12, -42),
  m(12, "Facundo Ortiz", "Crossfit", "Trimestral", 96000, -20, -110, [
    rem("r-3", 14, "Hola Facundo! Tu cuota trimestral venció, pasá por recepción."),
    rem("r-4", 5, "Hola Facundo! Seguimos esperando tu pago de Crossfit."),
  ]),
  m(13, "Milagros Peralta", "Pilates", "Mensual", 32000, -1, -31),
  m(14, "Bruno Castro", "Natación", "Anual", 330000, -45, -410),
];
