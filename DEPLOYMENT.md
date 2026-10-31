# Deployment & Domain Setup

This project deploys to **Vercel**. This document covers domains, redirects, DNS,
environment variables, and the Brevo newsletter handoff. Anything that must be done
by a human or in an external dashboard is called out explicitly.

## Domains

| Domain | Role |
| --- | --- |
| `letmeteachyouai.com` | **Canonical** production domain — everything resolves here |
| `www.letmeteachyouai.com` | Redirects to the canonical apex (`letmeteachyouai.com`) |
| `letmeteachyouai.net` | Permanent **301** redirect to `letmeteachyouai.com` |
| `www.letmeteachyouai.net` | Permanent **301** redirect to `letmeteachyouai.com` |

The goal is one consistent home for the brand and SEO: every visitor and every link
ends up on `https://letmeteachyouai.com`.

## Redirects: app-level and platform-level

The app enforces host-based redirects in [`proxy.ts`](./proxy.ts). For production,
configure equivalent redirects at the Vercel domain level as well so they remain
reliable even if app configuration changes.

## Vercel steps

1. Open the Vercel project → **Settings → Domains**.
2. Add the four domains listed above.
3. Set `letmeteachyouai.com` as the production/canonical domain.
4. Configure the other three as permanent redirects to the canonical domain.

## DNS records

Use the exact current values Vercel shows under **Settings → Domains**. Generic
records are typically:

| Type | Name / Host | Value |
| --- | --- | --- |
| `A` (or `ALIAS`/`ANAME`) | `@` | `76.76.21.21` or the current Vercel-provided value |
| `CNAME` | `www` | `cname.vercel-dns.com` |

## Environment variables

Set server-only secrets without a `NEXT_PUBLIC_` prefix.

**Required:**

| Variable | Notes |
| --- | --- |
| `OPENAI_API_KEY` | OpenAI secret key. Server only. |
| `OPENAI_MODEL` | Current OpenAI model; configurable. |
| `NEWSLETTER_API_KEY` | Brevo API key. Server only. |
| `NEWSLETTER_AUDIENCE_ID` | Numeric ID of the dedicated **LMTYAI-only** Brevo list. Do not use a VCF/GTA list. |
| `NEXT_PUBLIC_SITE_URL` | `https://letmeteachyouai.com` — canonical public URL. |

**Optional:**

| Variable | Notes |
| --- | --- |
| `OPENAI_MAX_OUTPUT_TOKENS` | Output ceiling for cost/latency (default `800`). |
| `OPENAI_TIMEOUT_MS` | Upstream timeout in ms (default `30000`). |
| `CONTACT_TO_EMAIL` | Inbox that receives contact-form messages. |

## Brevo setup

The app sends each valid signup to Supabase and, when configured, to Brevo using the
Brevo Contacts API. The Brevo list must be dedicated to LMTYAI.

1. Create a list such as **LMTYAI — Leads** in Brevo.
2. Authenticate an LMTYAI sender/domain before sending production email.
3. Set `NEWSLETTER_AUDIENCE_ID` to that dedicated list's numeric ID.
4. Set `NEWSLETTER_API_KEY` to a server-side Brevo API key with only the permissions
   needed for the newsletter workflow.
5. Build the welcome sequence from [`content/welcome-sequence.md`](./content/welcome-sequence.md)
   as a Brevo automation triggered when a contact joins the LMTYAI list.
6. Run a real test signup and verify: Supabase capture → Brevo contact/list → welcome
   delivery → Start Here → paid offer.

Do not repurpose the existing Vice City Forums sender or generic list for LMTYAI.

## Local development

```bash
npm run newsletter:test
npm run dev
npm run build
```

## Remaining launch checklist

- [ ] Dedicated LMTYAI Brevo list exists.
- [ ] LMTYAI sender/domain is authenticated in Brevo.
- [ ] Brevo welcome automation is active for the dedicated LMTYAI list.
- [ ] `NEWSLETTER_API_KEY` and `NEWSLETTER_AUDIENCE_ID` are configured in Vercel Preview and Production.
- [ ] A real signup reaches both Supabase and the LMTYAI Brevo list.
- [ ] The welcome email is actually delivered.
- [ ] Start Here and the paid offer work end-to-end.
- [ ] Domain redirects and TLS are verified.
