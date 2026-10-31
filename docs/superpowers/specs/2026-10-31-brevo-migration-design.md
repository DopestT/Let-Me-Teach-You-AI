# Brevo Migration Design

## Intent
Make Brevo the permanent email/CRM system for Let Me Teach You AI while retaining Supabase as the durable signup ledger. Eliminate Beehiiv from the live signup path and documentation so the company has one canonical marketing-email platform.

## Goals
- Website signups continue to succeed when either Supabase or Brevo captures the lead.
- Brevo receives new LMTYAI contacts with source attribution and a stable list assignment.
- No LMTYAI signup calls Beehiiv.
- Public privacy/deployment documentation reflects Brevo.
- Existing free lead magnet and post-signup routing remain unchanged.

## Non-goals
- Do not send a marketing campaign during the migration.
- Do not mix Vice City Forums contacts/templates with LMTYAI.
- Do not change pricing, course content, checkout, or the lead magnet.

## Constraints
- Keep provider calls server-side.
- Keep Supabase as an independent durable store/fallback.
- Use provider-agnostic `NEWSLETTER_*` environment names where practical.
- A missing provider configuration must remain an honest development fallback.

## Approach
Chosen approach: replace the Beehiiv implementation behind `lib/newsletter.ts` with Brevo's Contacts API, preserving the existing `subscribe()` interface so the rest of the application does not need a funnel rewrite. Use `NEWSLETTER_AUDIENCE_ID` as the Brevo list ID and `NEWSLETTER_API_KEY` as the server-only Brevo API key. Keep `NEWSLETTER_SIGNUP_TAG` as source attribution metadata when the Brevo contact schema supports it; otherwise preserve attribution in Supabase and logs.

Alternative considered: send signups only to Supabase and sync later. Rejected because it creates a new synchronization dependency and delays the permanent Brevo migration.

Alternative considered: replace Supabase entirely with Brevo. Rejected because Supabase already provides a valuable durable fallback when the email provider is unavailable.

## Verification
- Static regression audit must reject Beehiiv references in live newsletter integration/privacy/deployment configuration.
- Build must pass.
- Supabase project must be active before declaring the signup ledger operational.
- Brevo account must have a dedicated LMTYAI contact list before production wiring is considered complete.
