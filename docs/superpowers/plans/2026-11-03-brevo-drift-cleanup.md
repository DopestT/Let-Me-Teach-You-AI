# Brevo Drift Cleanup Plan

**Goal:** Remove stale Beehiiv operational surfaces without changing the verified Brevo signup and transactional welcome flow.

- [ ] Add regression checks covering the automation endpoint and canonical operational docs; verify RED.
- [ ] Replace the Beehiiv automation lookup with Brevo-aware configuration/status output.
- [ ] Update README, DEPLOYMENT, privacy, welcome-sequence, subscriber-store and contact-route wording.
- [ ] Verify newsletter audit, full build, and preview deployment.
- [ ] Recheck production health and Supabase restoration state before calling the funnel operational.
