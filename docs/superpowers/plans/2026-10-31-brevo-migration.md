# Brevo Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Brevo the permanent LMTYAI email/CRM provider while preserving Supabase as the durable signup ledger and existing funnel behavior.

**Architecture:** Keep the existing `subscribe()` provider interface and replace its Beehiiv HTTP implementation with Brevo Contacts API calls. Preserve the current parallel Supabase + provider capture in `/api/subscribe`, then update configuration/privacy/deployment documentation and add a regression audit that prevents Beehiiv from re-entering the live path.

**Tech Stack:** Next.js 16, TypeScript, server-side fetch, Supabase, Brevo Contacts API, existing Node audit scripts.

**Spec:** `docs/superpowers/specs/2026-10-31-brevo-migration-design.md`

## Global Constraints
- Brevo is the permanent marketing-email/CRM provider.
- Supabase remains an independent durable signup ledger/fallback.
- No marketing campaign is sent as part of this migration.
- Do not mix Vice City Forums contacts/templates with LMTYAI.
- Preserve the existing free lead magnet and post-signup route.

## Review Focus
- Existing Brevo contact: update/list assignment must be idempotent rather than fail.
- Brevo outage: Supabase success must still allow signup completion.
- Supabase outage: Brevo success must still allow signup completion.
- Missing Brevo configuration: development fallback must be explicit and not pretend an email was sent.
- Brand separation: VCF list/template/sender must not be used for LMTYAI signups.

---

### Task 1: Brevo contact capture adapter

**Files:**
- Modify: `lib/newsletter.ts`
- Modify: `.env.example`
- Test: `scripts/growth-audit.mjs`

**Interfaces:**
- Consumes: `subscribe({ email, firstName, referringSite, utmSource })`
- Produces: existing `SubscribeOutcome` contract unchanged.

- [ ] Add a failing regression check that the live newsletter adapter no longer contains Beehiiv endpoints/provider text and does contain Brevo Contacts API wiring.
- [ ] Run `npm run growth:audit` and verify it fails.
- [ ] Replace Beehiiv subscription creation with Brevo `POST /v3/contacts`, using `updateEnabled: true` and `listIds: [NEWSLETTER_AUDIENCE_ID]`.
- [ ] Preserve first-name/source attribution where supported without logging PII.
- [ ] Update `.env.example` to define Brevo semantics for the provider-agnostic newsletter variables.
- [ ] Run `npm run growth:audit` and verify it passes.

### Task 2: Remove stale Beehiiv operational surfaces

**Files:**
- Modify: `README.md`
- Modify: `DEPLOYMENT.md`
- Modify: `content/welcome-sequence.md`
- Modify: `app/privacy/page.tsx`
- Modify/Delete: `app/api/newsletter-automations/route.ts`
- Modify: `lib/subscribers.ts`

**Interfaces:**
- Produces: public/operator documentation that consistently identifies Brevo as the marketing email provider.

- [ ] Extend the regression audit to reject Beehiiv from the privacy/deployment/live provider surfaces.
- [ ] Run the audit and verify it fails on the stale references.
- [ ] Replace stale provider copy with Brevo-specific operational guidance.
- [ ] Remove or retire the Beehiiv automation-inspection endpoint so it cannot be mistaken for an active production dependency.
- [ ] Run the audit and verify it passes.

### Task 3: Restore durable signup ledger

**Files:**
- No source changes unless project state reveals a configuration defect.

**Interfaces:**
- Produces: active `let_me_teach_you_ai` Supabase project available to the existing `storeSubscriber()` path.

- [ ] Restore the inactive `let_me_teach_you_ai` Supabase project.
- [ ] Verify project status becomes active/healthy.
- [ ] Run security advisors and record any material blocker before declaring the ledger operational.

### Task 4: Establish Brevo LMTYAI isolation

**Files:**
- External configuration only.

**Interfaces:**
- Produces: dedicated LMTYAI list ID for `NEWSLETTER_AUDIENCE_ID` and a clean migration target separated from VCF.

- [ ] Create one dedicated Brevo contact list named `LMTYAI — Free AI Work Kit`.
- [ ] Do not alter or reuse the existing VCF list/templates.
- [ ] Verify the new list exists and starts isolated from the VCF contact.
- [ ] Record the list ID for deployment configuration.

### Task 5: Build and launch verification

**Files:**
- Modify as needed only for failures found by verification.

**Interfaces:**
- Produces: passing build and a migration branch/PR suitable for deployment.

- [ ] Run `npm run build` and fix only migration-related failures.
- [ ] Verify no Beehiiv call remains in the production signup path.
- [ ] Open a PR with the migration changes.
- [ ] Verify CI/status checks before merge.
- [ ] Do not declare the funnel DONE until the deployed environment has the Brevo secret + dedicated list ID and one end-to-end signup is observed in both Brevo and Supabase.
