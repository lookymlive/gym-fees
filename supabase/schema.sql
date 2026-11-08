-- Esquema sugerido para cuando pases de mock data a Supabase.
create type fee_plan as enum ('Mensual', 'Trimestral', 'Anual');
create type reminder_channel as enum ('WhatsApp', 'Email');

create table members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  activity text not null,
  plan fee_plan not null,
  amount integer not null check (amount > 0),
  due_date date not null,
  last_payment_date date,
  created_at timestamptz not null default now()
);

create table reminders (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  channel reminder_channel not null,
  message text not null,
  sent_at timestamptz not null default now()
);

alter table members enable row level security;
alter table reminders enable row level security;

-- Ajustá las políticas a tu modelo de roles (staff autenticado).
create policy "staff lee socios" on members for select to authenticated using (true);
create policy "staff escribe socios" on members for all to authenticated using (true) with check (true);
create policy "staff lee recordatorios" on reminders for select to authenticated using (true);
create policy "staff escribe recordatorios" on reminders for all to authenticated using (true) with check (true);
