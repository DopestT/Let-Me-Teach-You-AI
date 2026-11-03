# Brevo Drift Cleanup

## Intent
Finish the permanent Brevo cutover by removing stale Beehiiv operational references that remain after the live signup path migrated.

## Scope
- Keep the working Brevo signup + transactional Work Kit welcome path unchanged.
- Replace the stale Beehiiv automation diagnostic endpoint with provider-accurate Brevo status information.
- Update privacy, README, deployment, welcome-sequence, subscriber-store, and contact-route wording so operators and users are not told Beehiiv is active.
- Preserve historical migration records and third-party discovery references where Beehiiv is mentioned only as history or a marketplace, not as LMTYAI infrastructure.

## Verification
- Newsletter provider audit must fail if live/runtime or canonical operational docs claim Beehiiv is the provider.
- Existing Brevo signup/welcome contract checks remain intact.
- Build and Vercel preview must pass before integration.
