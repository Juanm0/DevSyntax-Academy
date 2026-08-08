-- Agrega soporte de pagos reales (Stripe) a la tabla de inscripciones.
-- Correr esto una sola vez en el SQL Editor de tu proyecto de Supabase.

alter table enrollments
  add column if not exists status text not null default 'pending', -- 'pending' | 'paid' | 'canceled'
  add column if not exists stripe_session_id text,
  add column if not exists amount_paid numeric,
  add column if not exists currency text,
  add column if not exists paid_at timestamptz;

-- Evita inscripciones duplicadas por usuario+curso (si no existía ya)
create unique index if not exists enrollments_user_course_unique
  on enrollments (user_id, course_id);

-- Índice para buscar rápido por sesión de Stripe desde el webhook
create index if not exists enrollments_stripe_session_idx
  on enrollments (stripe_session_id);
