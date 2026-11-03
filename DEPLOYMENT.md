# Deployment & Domain Setup

This project deploys to **Vercel**. This document covers domains, redirects, DNS,
and environment variables. Anything that must be done by a human (registrar DNS,
Vercel dashboard steps) is called out — nothing here is claimed to be done for you.

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

The app **already** enforces host-based redirects in
[`proxy.ts`](./proxy.ts) (Next.js 16 renamed the old `middleware` convention to
`proxy`). Today it sends `letmeteachyouai.net` and `www.letmeteachyouai.net` to the
canonical host (derived from `NEXT_PUBLIC_SITE_URL`), preserving path and query with
a 301.

That code is a good safety net, but the **recommended production setup is to also
configure the redirects at the Vercel domain level.** Platform-level redirects are
more reliable: they run before your app, handle the `www` → apex case for the `.com`
domain cleanly, and keep working even if `NEXT_PUBLIC_SITE_URL` is ever misconfigured.
Use both — belt and suspenders.

## Vercel steps (dashboard)

1. Open the Vercel project → **Settings → Domains**.
2. **Add all four domains** to the project:
   - `letmeteachyouai.com`
   - `www.letmeteachyouai.com`
   - `letmeteachyouai.net`
   - `www.letmeteachyouai.net`
3. Set **`letmeteachyouai.com` as the Production domain** (the primary/canonical
   domain the project serves from).
4. Configure the other three as **Redirects to `letmeteachyouai.com` (301, permanent):**
   - `www.letmeteachyouai.com` → `letmeteachyouai.com`
   - `letmeteachyouai.net` → `letmeteachyouai.com`
   - `www.letmeteachyouai.net` → `letmeteachyouai.com`

   In the Domains UI, each of these is added as a domain whose behavior is set to
   "Redirect to" the canonical domain, with the permanent (301) option enabled.

## DNS records (do at your registrar)

Vercel shows the exact, current records required under **Settings → Domains** for each
domain. Use those values if they differ from generic examples in older setup notes.

Notes:
- Apex domains (`@`) need an `A` record, or an `ALIAS`/`ANAME` record if your
  registrar supports it. `www` subdomains use a `CNAME`.
- After adding records, Vercel verifies ownership and issues TLS certificates
  automatically.

## Environment variables (Vercel → Settings → Environment Variables)

Set these for **Production and Preview**. Server-only secrets must **never** use the
`NEXT_PUBLIC_` prefix — that prefix ships a value to the browser.

**Required:**

| Variable | Notes |
| --- | --- |
| `OPENAI_API_KEY` | OpenAI secret key. **Server only — never exposed to the browser.** |
| `OPENAI_MODEL` | Current OpenAI model (e.g. `gpt-5-mini`). Configurable, not hard-coded. |
| `NEWSLETTER_API_KEY` | Brevo API key. **Server only — never exposed to the browser.** |
| `NEWSLETTER_AUDIENCE_ID` | Positive numeric Brevo List ID for the dedicated LMTYAI signup list. |
| `NEWSLETTER_SIGNUP_TAG` | Optional internal signup-source label; the code has a safe default. |
| `NEXT_PUBLIC_SITE_URL` | `https://letmeteachyouai.com` — drives metadata, canonical URLs, and the redirects in `proxy.ts`. Safe to expose. |

**Optional (safe defaults exist in code):**

| Variable | Notes |
| --- | --- |
| `OPENAI_MAX_OUTPUT_TOKENS` | Output ceiling for cost/latency (default `800`). |
| `OPENAI_TIMEOUT_MS` | Upstream timeout in ms (default `30000`). |
| `CONTACT_TO_EMAIL` | Inbox that receives contact-form messages. |

> **Security reminder:** `OPENAI_API_KEY` and `NEWSLETTER_API_KEY` are secrets. They
> must stay server-side only. Do not add a `NEXT_PUBLIC_` prefix to them and do not
> import them into client components.

## Brevo production contract

The production signup path uses Brevo in two server-side steps:

1. Add or update the subscriber in `NEWSLETTER_AUDIENCE_ID`.
2. Send the immediate AI Work Kit welcome email through Brevo transactional email
   from `hello@letmeteachyouai.com`.

Supabase remains the independent durable signup/referral ledger. The follow-up
five-email nurture sequence is separate from the immediate Work Kit delivery and
must not duplicate that first transactional message.

Use `/api/newsletter-health` as the safe readiness probe. A healthy production
configuration reports `provider: "brevo"` and `ready: true` without exposing the API
key or contact data.

## Local development

```bash
npm run dev      # local dev server at http://localhost:3000
npm run build    # production build (run before shipping to catch build errors)
```

## Deployment verification checklist

- [ ] Production deployment is `READY` and aliases include `letmeteachyouai.com`.
- [ ] `NEXT_PUBLIC_SITE_URL=https://letmeteachyouai.com`.
- [ ] `NEWSLETTER_API_KEY` is present server-side.
- [ ] `NEWSLETTER_AUDIENCE_ID` is a positive numeric Brevo list ID dedicated to LMTYAI.
- [ ] Brevo has an authenticated `letmeteachyouai.com` domain and active
      `hello@letmeteachyouai.com` sender.
- [ ] `/api/newsletter-health` returns `ready: true`.
- [ ] One real signup is confirmed in the LMTYAI Brevo list and in the Supabase
      signup ledger.
- [ ] The subscriber receives the immediate AI Work Kit email and can reach Course 1.
- [ ] `.net` and `www` redirects land on `https://letmeteachyouai.com`.
