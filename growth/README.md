# LMTYAI Growth Operator

This directory defines the contract for automated growth work on Let Me Teach You AI.

## Business goal

Optimize for qualified newsletter signups to the AI Work Kit, not raw article volume, impressions, or keyword count.

## Operating loop

1. Discover opportunities from search demand, audience questions, competitor gaps, community discussions, and existing-site performance.
2. Score opportunities for intent, relevance, conversion fit, difficulty, freshness, and information gain.
3. Create the smallest useful asset: refresh, guide, build, comparison, tool, or landing page.
4. Verify factual claims, duplication/cannibalization, internal links, metadata, schema, and conversion path.
5. Publish only after the configured review gate passes.
6. Measure acquisition and conversion behavior.
7. Adapt: refresh winners, merge cannibalizing pages, improve weak conversion paths, and stop low-value output.

## Guardrails

- No mass publishing for volume.
- No fabricated backlinks or automatic reciprocal-link schemes.
- No unverified factual claims.
- No duplicate/near-duplicate search pages.
- Keep consequential publishing behind review until the workflow has enough evidence to safely expand authority.
- Never log subscriber PII in growth analytics.

## First baseline

The first implementation fixes canonical-host drift, instruments the newsletter signup conversion, and establishes this growth contract. Content expansion follows after the baseline can be measured.
