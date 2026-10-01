# Perception Growth Operator — LMTYAI

This repository is the first internal proving ground for Perception Growth Operator v1.

## Business objective

Increase qualified AI Work Kit / newsletter signups for Let Me Teach You AI by attracting people who want to learn AI through practical building.

## Site and repository

- Canonical site: https://www.letmeteachyouai.com
- Repository: `DopestT/Let-Me-Teach-You-AI`
- Primary conversion: `newsletter_signup`

## Operating rules

1. Optimize for qualified signup growth, not raw article count.
2. Prefer improving an existing page when that creates more value than creating another page.
3. Tie proposed work to an observed opportunity and measurable reason.
4. Publishing remains approval-required during the proof phase.
5. Never publish unsupported statistics, testimonials, ranking claims, or generated factual claims without verification.
6. Preserve signup, privacy, terms, authentication, billing, and server-side API behavior unless a bounded job explicitly targets them.
7. Keep technical SEO changes standards-based and reversible.
8. Treat `llms.txt` as optional discovery metadata, not as a ranking guarantee.
9. Perception owns state, permissions, routing, verification, and learning; specialized workers remain replaceable.

## Proof loop

`discover → score → create/refresh → verify → publish (approval) → measure → adapt`

The machine-readable contract lives in `growth/operator-contract.json`; worker choices live in `growth/worker-registry.json`.
