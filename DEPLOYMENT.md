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

**These are not done yet** — we do not have access to the domain registrar. Whoever
manages DNS for the domains must add the records below. Vercel shows the exact,
current values under **Settings → Domains** for each domain; use those if they
differ from the generic values here.

**For `letmeteachyouai.com`:**

| Type | Name / Host | Value |
| --- | --- | --- |
| `A` (or `ALIAS`/`ANAME` at the apex) | `@` | `76.76.21.21` (or the IP Vercel provides) |
| `CNAME` | `www` | `cname.vercel-dns.com` |

**For `letmeteachyouai.net`:**

| Type | Name / Host | Value |
| --- | --- | --- |
| `A` (or `ALIAS`/`ANAME` at the apex) | `@` | `76.76.21.21` (or the IP Vercel provides) |
| `CNAME` | `www` | `cname.vercel-dns.com` |

Notes:
- Apex domains (`@`) need an `A` record, or an `ALIAS`/`ANAME` record if your
  registrar supports it. `www` subdomains use a `CNAME`.
- After adding records, Vercel verifies ownership and issues TLS certificates
  automatically. This can take anywhere from a few minutes to a few hours to
  propagate.

## Environment variables (Vercel → Settings → Environment Variables)

Set these for **Production and Preview**. Server-only secrets must **never** use the
`NEXT_PUBLIC_` prefix — that prefix ships a value to the browser.

**Required:**

| Variable | Notes |
| --- | --- |
| `OPENAI_API_KEY` | OpenAI secret key. **Server only — never exposed to the browser.** |
| `OPENAI_MODEL` | Current OpenAI model (e.g. `gpt-5-mini`). Configurable, not hard-coded. |
| `NEWSLETTER_API_KEY` | Beehiiv API key. **Server only — never exposed to the browser.** |
| `NEWSLETTER_AUDIENCE_ID` | Beehiiv Publication ID (`pub_xxxxxxxx`). |
| `NEWSLETTER_SIGNUP_TAG` | Tag applied to signups for segmentation / automations. |
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

## Local development

```bash
npm run dev      # local dev server at http://localhost:3000
npm run build    # production build (run before shipping to catch build errors)
```

## Remaining manual steps (checklist)

- [ ] Add all four domains to the Vercel project.
- [ ] Set `letmeteachyouai.com` as the Production domain.
- [ ] Configure `www.letmeteachyouai.com`, `letmeteachyouai.net`, and
      `www.letmeteachyouai.net` as 301 redirects to `letmeteachyouai.com`.
- [ ] Add DNS records at the registrar for **both** `.com` and `.net` (apex `A`/`ALIAS`
      + `www` `CNAME`).
- [ ] Set all required environment variables in Vercel (Production + Preview).
- [ ] Confirm `NEXT_PUBLIC_SITE_URL=https://letmeteachyouai.com`.
- [ ] Verify: visiting the `.net` domains and `www.letmeteachyouai.com` lands on
      `https://letmeteachyouai.com` with a 301.
- [ ] Verify TLS certificates are issued for all four domains.
