-- LMTYAI first-touch campaign attribution for the durable signup ledger.
-- This migration is review-only until explicitly applied to the production project.
alter table public.lmtyai_subscribers
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text;

create or replace function public.lmtyai_subscribe_with_utm(
  p_email text,
  p_first_name text,
  p_source text,
  p_ref text,
  p_utm_source text,
  p_utm_medium text,
  p_utm_campaign text,
  p_utm_content text,
  p_utm_term text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.lmtyai_subscribers;
  v_existing boolean := false;
  v_ref text;
begin
  p_email := lower(trim(p_email));
  if p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(p_email) > 254 then
    raise exception 'invalid email';
  end if;

  select referral_code into v_ref
  from public.lmtyai_subscribers
  where referral_code = p_ref;

  select * into v_row
  from public.lmtyai_subscribers
  where email = p_email;

  if found then
    v_existing := true;
  else
    insert into public.lmtyai_subscribers (
      email,
      first_name,
      source,
      referred_by,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term
    )
    values (
      p_email,
      nullif(left(trim(p_first_name), 80), ''),
      left(coalesce(p_source, 'website'), 160),
      v_ref,
      nullif(left(trim(coalesce(p_utm_source, '')), 160), ''),
      nullif(left(trim(coalesce(p_utm_medium, '')), 160), ''),
      nullif(left(trim(coalesce(p_utm_campaign, '')), 160), ''),
      nullif(left(trim(coalesce(p_utm_content, '')), 160), ''),
      nullif(left(trim(coalesce(p_utm_term, '')), 160), '')
    )
    returning * into v_row;
  end if;

  return json_build_object(
    'already', v_existing,
    'referral_code', v_row.referral_code,
    'referrals', (
      select count(*)
      from public.lmtyai_subscribers
      where referred_by = v_row.referral_code
    )
  );
end
$$;

revoke all on function public.lmtyai_subscribe_with_utm(text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.lmtyai_subscribe_with_utm(text, text, text, text, text, text, text, text, text) to anon, authenticated;
