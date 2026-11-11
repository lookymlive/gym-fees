export type FeeStatus = "al_dia" | "por_vencer" | "vencida";
export type Plan = "Mensual" | "Trimestral" | "Anual";
export type Channel = "WhatsApp" | "Email";
export type Scenario = "normal" | "vacio" | "error" | "lento";
export type View =
  | { name: "list" }
  | { name: "detail"; id: string }
  | { name: "form"; id?: string };

export interface Reminder {
  id: string;
  sentAt: string;
  channel: Channel;
  message: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  activity: string;
  plan: Plan;
  amount: number;
  dueDate: string;
  lastPaymentDate: string | null;
  reminders: Reminder[];
  joinedAt?: string;
  notes?: string;
  isActive?: boolean;
}

export type MemberInput = Pick<
  Member,
  "name" | "email" | "phone" | "activity" | "plan" | "amount" | "dueDate"
>;