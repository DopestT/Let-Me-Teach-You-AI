-- Let Me Teach You AI: subscriber capture + referrals.
-- Table is locked down by RLS; the site only touches it through the two
-- SECURITY DEFINER functions below, callable with the publishable key.
create table if not exists public.lmtyai_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  source text not null default 'website',
  referral_code text not null unique default substr(md5(gen_random_uuid()::text), 1, 8),
  referred_by text references public.lmtyai_subscribers(referral_code),
  created_at timestamptz not null default now()
);
alter table public.lmtyai_subscribers enable row level security;
revoke all on public.lmtyai_subscribers from anon, authenticated;

create or replace function public.lmtyai_subscribe(p_email text, p_first_name text default null, p_source text default 'website', p_ref text default null)
returns json language plpgsql security definer set search_path = public as $$
declare v_row public.lmtyai_subscribers; v_existing boolean := false; v_ref text;
begin
  p_email := lower(trim(p_email));
  if p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(p_email) > 254 then
    raise exception 'invalid email';
  end if;
  select referral_code into v_ref from lmtyai_subscribers where referral_code = p_ref;
  select * into v_row from lmtyai_subscribers where email = p_email;
  if found then v_existing := true;
  else
    insert into lmtyai_subscribers(email, first_name, source, referred_by)
    values (p_email, nullif(left(trim(p_first_name), 80), ''), left(coalesce(p_source, 'website'), 160), v_ref)
    returning * into v_row;
  end if;
  return json_build_object(
    'already', v_existing,
    'referral_code', v_row.referral_code,
    'referrals', (select count(*) from lmtyai_subscribers where referred_by = v_row.referral_code));
end $$;

create or replace function public.lmtyai_referral_stats(p_code text)
returns json language sql security definer set search_path = public as $$
  select json_build_object('referrals', count(*)) from lmtyai_subscribers where referred_by = p_code;
$$;

create or replace function public.lmtyai_subscriber_count()
returns integer language sql security definer set search_path = public as $$
  select count(*)::int from lmtyai_subscribers;
$$;

revoke all on function public.lmtyai_subscribe(text, text, text, text) from public;
revoke all on function public.lmtyai_referral_stats(text) from public;
revoke all on function public.lmtyai_subscriber_count() from public;
grant execute on function public.lmtyai_subscribe(text, text, text, text) to anon, authenticated;
grant execute on function public.lmtyai_referral_stats(text) to anon, authenticated;
grant execute on function public.lmtyai_subscriber_count() to anon, authenticated;
