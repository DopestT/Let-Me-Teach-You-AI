# Prompting for Productivity — Student Workbook

Design prompts you can reuse for communication, planning, research, and analysis—and improve them using evidence rather than magic phrases.

Estimated instructional time: 140 minutes. These are practice estimates, not a guaranteed duration.

**Completion outcome:** A tested mini prompt library with before/after examples, quality checks, and documented limitations.

**Privacy rule:** Use fictional or permissioned materials. Do not paste credentials, sensitive personal records, or confidential customer information.


---
## Part 1: Design an outcome-first prompt

**You should be able to:** Turn a vague request into a task with measurable success criteria.

### Working notes
- **Understand the principle:** There is no secret spell that guarantees the right answer. Successful prompts give the system a job it can actually do and an observable definition of done. Separate the source information from your preferences.
- **Use the method:** Use a task card with audience, context, constraints, output schema, and test. For each requested fact, tell the model which supplied source supports it or ask it to label it as missing.

### Compare the prompts
**Weak:** Make a marketing plan for my shop.

**Improved:** Using the fictional shop description below, propose a seven-day customer feedback test. Budget: zero. Output a table with activity, audience, effort and how we will measure a real response. Do not invent sales data.

**Verify:** The plan respects the zero-budget constraint and measures observable responses, not made-up ROI.

### Your practice
1. Write your task as a one-sentence deliverable.
2. Specify three constraints and two measurable tests.
3. Compare a first draft with the improved prompt; keep both.

### Your evidence log
- Date: __________
- Input/source: __________
- What the AI produced: __________
- What you checked or changed: __________
- What remains unknown: __________

### Knowledge check
Which instruction makes a prompt more testable?
- A. Make it amazing
- B. Provide 5 steps that fit the supplied 2-hour budget
- C. Use professional language

### Short instructional video script — draft, not filmed
- **Opening:** Strong prompts start with the job, not flattery.
- **On screen:** Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.
- **Close:** Pause and complete the exercise; keep your evidence and revisit anything the tool guessed.


---
## Part 2: Iterate without losing the facts

**You should be able to:** Use critique, correction, and selective regeneration to improve a draft.

### Working notes
- **Understand the principle:** When an output is wrong, repeating the same vague prompt often produces more polished errors. Diagnose the failure type: missing facts, unwanted assumptions, wrong format, unsafe action, or poor prioritization.
- **Use the method:** Use a review loop: TEST → IDENTIFY → CONSTRAIN → RETEST. Quote the defective fragment, explain the violated criterion, then request only the needed change. Keep a human-readable diff.

### Compare the prompts
**Weak:** The email is too formal; redo everything and make it better.

**Improved:** Revise only the greeting and closing in the supplied draft for a friendly client tone. Keep all dates, price figures, and promises exactly as provided. Return the changed lines and a list of unchanged facts.

**Verify:** The requested tone changes but the numerical and contractual details do not drift.

### Your practice
1. Generate one first draft with a deliberately incomplete prompt.
2. Mark three concrete defects and categorize them.
3. Write a constrained repair prompt; compare both outputs line by line.

### Your evidence log
- Date: __________
- Input/source: __________
- What the AI produced: __________
- What you checked or changed: __________
- What remains unknown: __________

### Knowledge check
What is a safe correction to a mostly good draft?
- A. Ask for a completely different answer
- B. Request a targeted revision that preserves verified facts
- C. Tell it to be more confident

### Short instructional video script — draft, not filmed
- **Opening:** You do not need a new answer when only one sentence is wrong.
- **On screen:** Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.
- **Close:** Pause and complete the exercise; keep your evidence and revisit anything the tool guessed.


---
## Part 3: Prompt for evidence-aware analysis

**You should be able to:** Produce a traceable research table with explicit unknowns.

### Working notes
- **Understand the principle:** Models can invent links, quotations, and studies. A good research prompt requests original sources where tools support browsing and a clear separation between citation, paraphrase, inference, and open question.
- **Use the method:** Ask for a claim table with source title, URL, source date, event date, exact support, and reliability notes. Then open primary materials yourself. If browsing is not available, require 'source unavailable' rather than fabricated citations.

### Compare the prompts
**Weak:** Find six studies proving my preferred answer.

**Improved:** Compare only the three supplied study abstracts on their stated populations, methods, outcomes, and limitations. List what cannot be concluded from abstracts alone. Add no invented numbers or references.

**Verify:** Every cited detail is actually visible in the supplied abstracts; disagreement is preserved.

### Your practice
1. Gather two primary sources and one secondary summary.
2. Make a claim/evidence/uncertainty matrix.
3. Independently recheck at least two dates and two numeric claims.

### Your evidence log
- Date: __________
- Input/source: __________
- What the AI produced: __________
- What you checked or changed: __________
- What remains unknown: __________

### Knowledge check
What should appear when the requested study is not provided or accessible?
- A. A plausible citation
- B. An explicit evidence gap
- C. A confident summary from memory

### Short instructional video script — draft, not filmed
- **Opening:** Citations are evidence only if they really point to the claim.
- **On screen:** Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.
- **Close:** Pause and complete the exercise; keep your evidence and revisit anything the tool guessed.


---
## Part 4: Turn a successful prompt into a reusable template

**You should be able to:** Build a template with fields, examples, stop rules, and verification steps.

### Working notes
- **Understand the principle:** A good reusable prompt is a little procedure, not a wall of words. It tells a future user what to supply, when the system should ask for missing data, and how to judge the result.
- **Use the method:** Create three templates: communication, planning, and analysis. Use [GOAL], [AUDIENCE], [FACTS], [CONSTRAINTS], [OUTPUT], and [CHECKS] placeholders. Include one filled example but no real personal data.

### Compare the prompts
**Weak:** Each time, remember everything about my business and do the right thing.

**Improved:** Template: [GOAL]. Audience: [AUDIENCE]. Verified facts: [FACTS]. Constraints: [CONSTRAINTS]. Output: [OUTPUT]. If an essential fact is missing, mark it unknown before writing. Self-check: [CHECKS].

**Verify:** Another learner can use the template without needing access to your previous chats.

### Your practice
1. Create a communication template and fill in a fictional example.
2. Create a planning template and specify error checks.
3. Create an analysis template that requires source evidence and uncertainty labels.

### Your evidence log
- Date: __________
- Input/source: __________
- What the AI produced: __________
- What you checked or changed: __________
- What remains unknown: __________

### Knowledge check
A reusable template should primarily contain...
- A. Hidden assumptions
- B. Clear input slots and validation checks
- C. A demand for certainty

### Short instructional video script — draft, not filmed
- **Opening:** Turn a good one-off prompt into a tool another person can use.
- **On screen:** Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.
- **Close:** Pause and complete the exercise; keep your evidence and revisit anything the tool guessed.


---
## Part 5: Evaluate and ship a prompt library

**You should be able to:** Deliver three tested prompts with examples and a scorecard.

### Working notes
- **Understand the principle:** A prompt library is only valuable if it reliably helps real people finish a task. Keep the original failure alongside the improved version so the improvement is inspectable. Avoid claiming accuracy improvements without measurements.
- **Use the method:** Test each template twice on different safe inputs. Score factual fidelity, task completion, format, missing-data handling, privacy, and ease of editing from 0–2. A 10/12 is not a magic guarantee; record defects and retest.

### Compare the prompts
**Weak:** These are my ultimate prompts; they always work.

**Improved:** For each of my three templates, create two fictional test cases, describe expected output, compare against the six checks, and list one failure case. Give me a change log, not a claim of perfection.

**Verify:** The library includes three prompts, six tests, visible scoring, and limitations.

### Your practice
1. Package three final prompts with short usage instructions.
2. Run two tests per prompt; record before/after and scores.
3. Share only safe examples and identify any human approval needed for real use.

### Your evidence log
- Date: __________
- Input/source: __________
- What the AI produced: __________
- What you checked or changed: __________
- What remains unknown: __________

### Knowledge check
What counts as measured prompt improvement?
- A. The response looks nicer
- B. It passes more predefined tests on comparable inputs
- C. It is longer

### Short instructional video script — draft, not filmed
- **Opening:** Finish with prompts that have earned their place in your toolkit.
- **On screen:** Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.
- **Close:** Pause and complete the exercise; keep your evidence and revisit anything the tool guessed.


---
## Instructor Answer Key (self-check)
1. **B** — A time budget and a specified output can be checked.
2. **B** — Narrow revisions reduce accidental changes to good material.
3. **B** — A missing source must be reported, not fabricated.
4. **B** — Inputs and tests make prompts transferable.
5. **B** — Evaluate against the same observable criteria before claiming improvement.


## Completion rubric
Score 0 (not demonstrated), 1 (partial), or 2 (demonstrated) for each of: outcome achieved, facts verified, sensitive-data care, error handling, and reproducibility. A score out of 10 is a learning checkpoint, not a guarantee of performance.


## Launch evidence
A preview, repository commit, script, or draft workbook is not proof of filmed videos, paid delivery, student access, or production launch. Do not claim enrollment or completion until an independent student can use the materials end to end.