import type { FeeStatus, Member, Plan } from "@/types";

const DAY = 86_400_000;
const pad = (n: number) => String(n).padStart(2, "0");

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayISO = () => toISO(new Date());

const parse = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export function daysUntil(iso: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((parse(iso).getTime() - now.getTime()) / DAY);
}

export function getStatus(dueDate: string): FeeStatus {
  const n = daysUntil(dueDate);
  if (n < 0) return "vencida";
  if (n <= 7) return "por_vencer";
  return "al_dia";
}

export const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

export const formatDate = (iso: string) =>
  parse(iso.slice(0, 10)).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export const PLAN_MONTHS: Record<Plan, number> = {
  Mensual: 1,
  Trimestral: 3,
  Anual: 12,
};

export function nextDueDate(m: Pick<Member, "dueDate" | "plan">): string {
  const base = daysUntil(m.dueDate) < 0 ? new Date() : parse(m.dueDate);
  base.setMonth(base.getMonth() + PLAN_MONTHS[m.plan]);
  return toISO(base);
}

export function dueLabel(dueDate: string): string {
  const n = daysUntil(dueDate);
  if (n === 0) return "Vence hoy";
  if (n === 1) return "Vence mañana";
  if (n > 1) return `Vence en ${n} días`;
  if (n === -1) return "Venció ayer";
  return `Venció hace ${Math.abs(n)} días`;
}

export function buildReminderMessage(m: Member): string {
  const first = m.name.split(" ")[0];
  const when =
    getStatus(m.dueDate) === "vencida"
      ? `venció el ${formatDate(m.dueDate)}`
      : `vence el ${formatDate(m.dueDate)}`;
  return `Hola ${first}! Te recordamos que tu cuota ${m.plan.toLowerCase()} de ${m.activity} (${formatARS(
    m.amount
  )}) ${when}. Podés abonarla en recepción o por transferencia. ¡Gracias!`;
}

export const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function generateId(prefix = "id"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^[\d\s\-+()]{7,}$/.test(phone);
}

export function formatNumber(value: number, locale = "es-AR"): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function parseISODate(iso: string): Date | null {
  const [y, m, d] = iso.split("-").map(Number);
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
  return new Date(y, m - 1, d);
}
