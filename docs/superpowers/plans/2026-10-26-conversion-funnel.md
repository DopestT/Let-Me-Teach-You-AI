# LMTYAI Conversion Funnel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a clear free-to-paid funnel from the AI Work Kit into onboarding and a $29 AI Build Review offer without breaking existing free learning.

**Architecture:** Keep the existing free content intact and add three server-rendered public pages plus post-signup routing. Checkout is an optional public URL configured by environment; when absent, the Build Review page captures interest using the existing subscriber flow rather than exposing a broken CTA.

**Tech Stack:** Next.js 16, React 19, TypeScript 5.7, Tailwind CSS, Vercel Analytics, existing SignupForm and growth audit.

**Spec:** `docs/superpowers/specs/2026-10-26-conversion-funnel-design.md`

## Global Constraints
- Existing primary conversion remains `newsletter_signup`.
- Existing Work Kit, AI Lab, guides, workshop, and flagship course remain free and accessible.
- Do not hard-code payment-provider credentials or a checkout URL.
- Use `NEXT_PUBLIC_BUILD_REVIEW_CHECKOUT_URL` for the optional external checkout URL.
- Paid offer price is $29 one-time.
- If checkout is not configured, capture interest rather than render a dead purchase link.

## Review Focus
- Missing checkout environment value must produce a usable interest-capture state.
- Existing signup surfaces must keep their current behavior after adding a stay-on-page success state.
- Thank-you page must still expose the immediate Work Kit download.
- New pages must remain reachable from navigation or the post-signup funnel.
- Growth audit must fail if the monetization bridge disappears.

---

### Task 1: Add offer-aware signup success state

**Files:**
- Modify: `components/signup-form.tsx`

**Interfaces:**
- Consumes: existing `/api/subscribe` response.
- Produces: optional `successMessage` prop used by the Build Review interest state.

- [ ] Extend status to include `success` and accept `successMessage?: string`.
- [ ] On successful `stay` submission, show the success message without redirecting.
- [ ] Preserve all existing redirecting signup behavior.

### Task 2: Add conversion pages

**Files:**
- Create: `app/start-here/page.tsx`
- Create: `app/pricing/page.tsx`
- Create: `app/build-review/page.tsx`

**Interfaces:**
- Consumes: existing course routes, AI Work Kit route, AI Lab anchor, workshop, SignupForm.
- Produces: public onboarding and monetization routes.

- [ ] Build Start Here with ordered next steps and links to free learning plus Build Review.
- [ ] Build Pricing with Free and AI Build Review tiers.
- [ ] Build Build Review offer with scope, exclusions, $29 price, optional checkout URL, and interest fallback.

### Task 3: Connect post-signup and site navigation

**Files:**
- Modify: `app/thank-you/page.tsx`
- Modify: `components/site-header.tsx`
- Modify: `components/site-footer.tsx`
- Modify: `app/sitemap.ts`
- Modify: `.env.example`

**Interfaces:**
- Consumes: routes from Task 2.
- Produces: discoverable funnel and documented checkout hook.

- [ ] Keep immediate Work Kit download on thank-you and add Start Here + Build Review next steps.
- [ ] Add Pricing to primary navigation.
- [ ] Add Start Here, Pricing, Build Review to footer.
- [ ] Add new public routes to sitemap.
- [ ] Document `NEXT_PUBLIC_BUILD_REVIEW_CHECKOUT_URL`.

### Task 4: Add build-time funnel checks

**Files:**
- Modify: `scripts/growth-audit.mjs`

**Interfaces:**
- Consumes: route files and navigation from Tasks 2–3.
- Produces: build failure if conversion bridge regresses.

- [ ] Assert all three route files exist.
- [ ] Assert thank-you links to `/start-here` and `/build-review`.
- [ ] Assert header links to `/pricing`.
- [ ] Assert `.env.example` documents the checkout URL.
- [ ] Run the repository build/growth audit in preview CI and inspect the result.
