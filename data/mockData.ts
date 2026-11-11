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
  phone: `+54 9 341 555-${String(1000 + n * 37).padStart(4, "0")}`,
  activity,
  plan,
  amount,
  dueDate: d(due),
  lastPaymentDate: paid === null ? null : d(paid),
  reminders,
  joinedAt: d(-Math.floor(Math.random() * 730) - 30),
  notes: n % 5 === 0 ? "Preferencia: pago por transferencia" : "",
  isActive: true,
});

export const initialMembers: Member[] = [
  // Al día (días positivos = vencen en el futuro)
  m(1, "Lucía Fernández", "Musculación", "Mensual", 28000, 20, -10),
  m(2, "Joaquín Paredes", "Natación", "Trimestral", 72000, 55, -35),
  m(3, "Valentina Ruiz", "Pilates", "Mensual", 32000, 14, -16),
  m(4, "Santiago Molina", "Crossfit", "Anual", 360000, 210, -155),
  m(5, "Agustina Ledesma", "Yoga", "Mensual", 26000, 25, -5),
  m(15, "Mateo Vargas", "Funcional", "Mensual", 30000, 18, -12),
  m(16, "Sofía Herrera", "Boxeo", "Trimestral", 84000, 60, -30),
  m(17, "Lucas Domínguez", "Musculación", "Mensual", 28000, 22, -8),
  m(18, "Emma Torres", "Pilates", "Mensual", 32000, 15, -20),

  // Por vencer (≤ 7 días)
  m(6, "Martín Giménez", "Crossfit", "Mensual", 35000, 2, -28, [
    rem("r-1", 1, "Hola Martín! Te recordamos que tu cuota mensual de Crossfit vence pronto."),
  ]),
  m(7, "Camila Rossi", "Natación", "Mensual", 30000, 0, -30),
  m(8, "Tomás Acosta", "Musculación", "Trimestral", 78000, 5, -85),
  m(9, "Florencia Benítez", "Spinning", "Mensual", 29000, 7, -23),
  m(19, "Diego Fernández", "Yoga", "Mensual", 26000, 3, -27),
  m(20, "Valeria Gómez", "Funcional", "Mensual", 30000, 1, -31),

  // Vencidas (días negativos = ya vencieron)
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
  m(21, "Paula Ríos", "Spinning", "Mensual", 29000, -5, -35),
  m(22, "Andrés Medina", "Boxeo", "Trimestral", 84000, -15, -105),
];

export const activities = [
  "Musculación",
  "Natación",
  "Pilates",
  "Crossfit",
  "Yoga",
  "Spinning",
  "Funcional",
  "Boxeo",
  "Running",
  "Stretching",
] as const;

export const plans: Plan[] = ["Mensual", "Trimestral", "Anual"];