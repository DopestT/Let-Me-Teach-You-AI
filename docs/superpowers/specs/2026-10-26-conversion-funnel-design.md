# LMTYAI Conversion Funnel Design

## Intent
Turn the current free lead-magnet flow into a deliberate path from paid-ad click to subscriber, useful first experience, and an honest first paid offer without putting the already-public course behind fake or insecure gating.

## Goals
- Preserve the existing free AI Work Kit, AI Lab, guides, workshop, and flagship course.
- Remove the post-signup dead end after the Work Kit download.
- Give new subscribers one clear “Start Here” path.
- Add a visible monetization surface.
- Make the first paid offer distinct from existing free content.
- Keep checkout wiring optional so the site never shows a broken purchase button.
- Preserve the current LMTYAI visual language and beginner-first tone.

## Non-goals
- Do not implement Stripe or another payment processor in this change.
- Do not gate the existing public course.
- Do not promise income outcomes or unsupported delivery guarantees.
- Do not redesign the homepage or information architecture wholesale.

## Constraints
- Next.js 16 / React 19 / TypeScript 5.7.
- Existing primary conversion remains `newsletter_signup`.
- Existing free content remains accessible.
- Payment URL must come from an environment variable, never hard-coded.
- If checkout is unavailable, capture build-review interest instead of rendering a dead purchase CTA.

## Approaches considered

### 1. Charge for the existing flagship course
Rejected for now. The course and lesson routes are already public, so charging for the same access without real entitlement checks would be misleading and trivial to bypass.

### 2. Add a low-ticket paid service after the free funnel
Selected. Offer a $29 one-time AI Build Review: the customer submits one AI-related idea, page, workflow, or project and receives a focused written review with prioritized next actions. This creates a real paid step that does not require content gating.

### 3. Add only a generic pricing page and defer the product
Rejected as too weak. It creates navigation without creating a concrete next action.

## Product flow
Commercial → ad click → homepage / landing experience → free Work Kit signup → thank-you page → Start Here → free learning / use → AI Build Review offer → checkout hook → manual fulfillment.

## Pages
- `/start-here`: ordered onboarding path after the Work Kit.
- `/pricing`: simple free-vs-paid value ladder.
- `/build-review`: detailed $29 Build Review offer. If `NEXT_PUBLIC_BUILD_REVIEW_CHECKOUT_URL` exists, show checkout CTA. Otherwise show an interest-capture form.
- Existing `/thank-you`: keep immediate Work Kit download, then route into Start Here and the paid offer instead of ending at “Back to home.”

## Navigation and discovery
- Add Pricing to the primary navigation.
- Add Start Here, Pricing, and Build Review to the footer.
- Add the new public pages to the sitemap.

## Verification
Extend `scripts/growth-audit.mjs` so builds fail if the new funnel pages disappear, the thank-you page loses its next-step links, the checkout URL environment hook is undocumented, or navigation loses the pricing link.
