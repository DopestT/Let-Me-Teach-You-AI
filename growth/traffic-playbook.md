# Traffic Playbook: getting visitors to the signup forms

Every link below should point at a tracked page so Supabase `source` shows what's working:
- Homepage: `https://letmeteachyouai.com/?utm_source=<channel>`
- Workshop: `https://letmeteachyouai.com/workshop`
- Work Kit: `https://letmeteachyouai.com/ai-work-kit`

Check results anytime in Supabase:
```sql
select source, count(*) from lmtyai_subscribers group by 1 order by 2 desc;
select count(*) filter (where referred_by is not null) as referred, count(*) as total from lmtyai_subscribers;
```

## 1. Short videos (TikTok, Reels, Shorts, LinkedIn) — 30 days

Post format, every video: hook (0–2s), show the screen (AI doing the task), result, then the CTA: "The full workflow plus 25 free prompts — link in bio."

| Day | Hook |
|---|---|
| 1 | "I made AI answer my emails while I slept. Here's the exact prompt." |
| 2 | "Stop using ChatGPT like Google. Use it like an employee." |
| 3 | "Turn a 1-hour meeting into a to-do list in 20 seconds." |
| 4 | "3 prompts every small business owner should save today." |
| 5 | "I asked AI to build me a quote calculator. No code." |
| 6 | "The mistake 90% of beginners make with AI (and the fix)." |
| 7 | "One blog post → 5 social posts → 1 newsletter. Watch." |
| 8 | "How to make AI stop making stuff up: the 2-source rule." |
| 9 | "Build an AI workflow from plain English, live in 60 seconds." |
| 10 | "Your first AI agent should be boring. Here's why." |
| 11–30 | Repeat the 10 formats on new tasks: invoices, scheduling, customer FAQs, research briefs, social captions, job posts, product descriptions, lesson plans, travel plans, budgets. |

Pin the best-performing video. Link in bio → `https://letmeteachyouai.com/?utm_source=tiktok` (swap source per platform).

## 2. Newsletter swaps

Pitch 10 newsletters with 1k–20k subscribers in AI, solopreneur, and small-business topics (find them on Beehiiv Boosts, Kit Creator Network, and SparkLoop).

> Subject: Recommend swap?
>
> Hi [Name] — I run Let Me Teach You AI, a beginner newsletter where readers build one useful AI workflow each week (no coding). Your readers at [Newsletter] look like a close fit with mine. Want to swap a short recommendation in our next issues? Happy to go first. — [Your name], letmeteachyouai.com

## 3. Community answers (Reddit, Facebook groups, LinkedIn)

Targets: r/ChatGPT, r/smallbusiness, r/Entrepreneur, r/productivity, r/nocode, and local Facebook business groups (Bethesda/DMV small-business groups).
Rule: answer fully first, link second. Template:

> Here's how I'd do it: [3–5 concrete steps + the prompt]. I wrote up the full workflow with a test checklist here if it helps: [guide link]

Aim for 3 helpful answers per day. Never post only a link.

## 4. Free live workshop

Page: `/workshop` (signups tagged `source = workshop`).
1. Pick a date and time (Tuesday or Wednesday, 12pm or 7pm ET), and host it on Zoom/YouTube Live/StreamYard.
2. Email workshop signups: confirmation now, a reminder 24h before, a reminder 1h before, then the replay link.
3. Promote: 3 short videos counting down, posts in communities, and an email to the existing list ("bring a friend").
4. Run it monthly; each replay becomes a YouTube video linking back to `/workshop`.

## 5. Referral program (live)

After signing up, people see their link at `/thank-you?r=CODE`. Once 3 friends join with it, `/bonus` unlocks 5 advanced workflows. Mention it in welcome email #2 and in every issue's footer:

> Share Let Me Teach You AI with 3 friends → unlock 5 bonus workflows. Your link: https://letmeteachyouai.com/thank-you?r={{referral_code}}

## 6. Search (SEO)

The `/guides` system already targets "how to … with AI" searches. Add 2 guides a week on high-intent beginner searches: "how to use AI for small business", "AI email automation without code", "ChatGPT prompts for real estate agents", "how to build an AI agent for beginners". Each guide already ends with a signup form.
