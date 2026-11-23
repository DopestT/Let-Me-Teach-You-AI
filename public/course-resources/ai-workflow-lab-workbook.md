# AI Workflow Lab — Student Workbook

Build a practical, observable AI-assisted workflow with privacy checks, human approval, failure handling, and a capstone rubric.

Estimated instructional time: 165 minutes. These are practice estimates, not a guaranteed duration.

**Completion outcome:** A repeatable workflow specification, test log, and pilot-ready manual fallback.

**Privacy rule:** Use fictional or permissioned materials. Do not paste credentials, sensitive personal records, or confidential customer information.


---
## Part 1: Map one real process

**You should be able to:** Document a trigger, input, decision, owner, result, and log before choosing software.

### Working notes
- **Understand the principle:** Automating an unclear process makes unclear mistakes happen faster. Start with a task already performed manually: intake, classify, draft, review, send. Record who owns each step.
- **Use the method:** Draw trigger → validate → AI transformation → human review → action → evidence log. Name the data you are allowed to use and what must never enter the model.

### Compare the prompts
**Weak:** Automate my entire business.

**Improved:** For fictional volunteer inquiries: when a form arrives, validate name and question, classify topic, draft a reply, hold for organizer approval, then record whether a response was sent.

**Verify:** Every step has an owner and the final action waits for approval.

### Your practice
1. Choose one repeated task and time three manual runs.
2. Draw each step and label inputs, outputs, and people.
3. Identify one step to automate and one step to retain manually.

### Your evidence log
- Date: __________
- Input/source: __________
- What the AI produced: __________
- What you checked or changed: __________
- What remains unknown: __________

### Knowledge check
What should you automate first?
- A. An undefined process with many exceptions
- B. One narrow repeated step with observable output
- C. All production decisions at once

### Short instructional video script — draft, not filmed
- **Opening:** A map of the process is more valuable than an automation screenshot.
- **On screen:** Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.
- **Close:** Pause and complete the exercise; keep your evidence and revisit anything the tool guessed.


---
## Part 2: Validate inputs and outputs

**You should be able to:** Define exactly what the automation accepts, rejects, and records.

### Working notes
- **Understand the principle:** Models are not validators. Validate required fields before sending input; bound lengths; reject unexpected formats; minimize personal data. Treat model output as untrusted until checked.
- **Use the method:** Define a small contract: request_id, category, non-sensitive summary, status, and reviewer approval. Test empty, duplicate, overlong, and instruction-injection-like text. Never let source text override workflow policy.

### Compare the prompts
**Weak:** Take any input and send an email automatically.

**Improved:** Accept a fictional inquiry only if category is from the allowlist and summary has a maximum size; create a draft response and status 'needs_review'. If data are invalid, return 'needs_manual_attention' without sending.

**Verify:** Invalid or malicious-looking inputs cannot directly trigger an external action.

### Your practice
1. Write five sample records: normal, missing, duplicate, unusual, malicious instruction.
2. State validation rules and expected outcomes for each.
3. Create a manual exception queue and privacy retention note.

### Your evidence log
- Date: __________
- Input/source: __________
- What the AI produced: __________
- What you checked or changed: __________
- What remains unknown: __________

### Knowledge check
Which is a correct use of model-generated output?
- A. Treat it as a trusted command
- B. Validate it before downstream action
- C. Give it direct production access

### Short instructional video script — draft, not filmed
- **Opening:** A reliable workflow knows what to do when input is wrong.
- **On screen:** Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.
- **Close:** Pause and complete the exercise; keep your evidence and revisit anything the tool guessed.


---
## Part 3: Design an approval gate

**You should be able to:** Keep consequential actions under human control and preserve a manual fallback.

### Working notes
- **Understand the principle:** The goal is fewer repetitive steps, not an unaccountable system. If a workflow might contact customers, publish, spend, erase, or mutate production data, require an authorized reviewer until controlled evidence supports any change.
- **Use the method:** Design a draft queue with Approve / Edit / Reject options. The action should only execute on an approved record, with deduplication and a short event log. Define what happens when the model or API fails.

### Compare the prompts
**Weak:** If the AI says the answer is good, send it to everyone.

**Improved:** Create a draft and hold it for review. If approval is absent, the system must not send. If the provider is offline, put the item in a human queue and log a non-sensitive error code.

**Verify:** A simulated failed review prevents sends and retains the draft for manual action.

### Your practice
1. Write the approval requirement as an explicit state rule.
2. Describe a failure scenario and how the human completes the task.
3. List the minimum log fields without storing unnecessary secrets.

### Your evidence log
- Date: __________
- Input/source: __________
- What the AI produced: __________
- What you checked or changed: __________
- What remains unknown: __________

### Knowledge check
What happens when the reviewer has not approved a customer email?
- A. Send it after five minutes
- B. Keep it as a draft
- C. Ask the AI to approve itself

### Short instructional video script — draft, not filmed
- **Opening:** An approval gate is a product feature, not a slowdown.
- **On screen:** Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.
- **Close:** Pause and complete the exercise; keep your evidence and revisit anything the tool guessed.


---
## Part 4: Test the entire workflow

**You should be able to:** Run normal, error, duplicate, and adversarial tests against expected results.

### Working notes
- **Understand the principle:** A green build means code compiled, not that the workflow produced the intended real-world outcome. Define an acceptance matrix and collect actual observations for each test.
- **Use the method:** For each test record input type, expected behavior, observed result, evidence link, and pass/fail. Include a privacy check and a restart/retry case. Avoid logging raw personal content.

### Compare the prompts
**Weak:** Looks good. Ship it.

**Improved:** Run seven sandbox cases with labeled synthetic data: normal, missing field, duplicate, long input, API failure, false approval, and retry. Report each expected result against observed logs, then identify defects.

**Verify:** The evidence shows whether state transitions and final actions matched the test contract.

### Your practice
1. Create seven expected-result cases before running the system.
2. Test locally with synthetic records; do not use real customer inboxes.
3. Fix one observed failure and rerun its case, then record the evidence.

### Your evidence log
- Date: __________
- Input/source: __________
- What the AI produced: __________
- What you checked or changed: __________
- What remains unknown: __________

### Knowledge check
What does a passing unit test prove?
- A. Every real customer can use the system
- B. That specific test passed under its conditions
- C. The workflow is legally compliant

### Short instructional video script — draft, not filmed
- **Opening:** Good automation tests are evidence, not green decorations.
- **On screen:** Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.
- **Close:** Pause and complete the exercise; keep your evidence and revisit anything the tool guessed.


---
## Part 5: Finish a controlled workflow pilot

**You should be able to:** Package a safe pilot with manual operating instructions and a measurable outcome.

### Working notes
- **Understand the principle:** A pilot is done when a real, authorized user can complete the job and recover from errors. Local tests are necessary but insufficient. Separate pilot evidence from a production launch decision.
- **Use the method:** Create a handoff containing process map, data contract, prompt, approval rule, seven-case matrix, rollback/manual fallback, and a scorecard. Run an authorized small-scale pilot only after separate permission.

### Compare the prompts
**Weak:** Our agent is built, so it is live and successful.

**Improved:** We have a draft-only workflow with seven synthetic tests. Production delivery and real-user acceptance remain unverified. Next gate: review a restricted pilot plan and explicitly approve any live integrations.

**Verify:** The handoff is honest about what is tested versus merely designed.

### Your practice
1. Assemble the process map, contract, test matrix, and manual fallback.
2. Score reliability (0–4), privacy (0–4), clarity (0–4), and evidence (0–4).
3. List remaining approvals and the smallest safe real-user test.

### Your evidence log
- Date: __________
- Input/source: __________
- What the AI produced: __________
- What you checked or changed: __________
- What remains unknown: __________

### Knowledge check
When is an automated service actually done?
- A. When a bot says success
- B. When an authorized user can complete the intended job with evidence
- C. When the design is attractive

### Short instructional video script — draft, not filmed
- **Opening:** End with a workflow someone can trust, test and operate.
- **On screen:** Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.
- **Close:** Pause and complete the exercise; keep your evidence and revisit anything the tool guessed.


---
## Instructor Answer Key (self-check)
1. **B** — A bounded step is easier to test and reverse.
2. **B** — AI output is untrusted input to the next step.
3. **B** — No approval means no consequential action.
4. **B** — Each test supports only the behavior it exercised.
5. **B** — The user-complete outcome is the standard, not the existence of code.


## Completion rubric
Score 0 (not demonstrated), 1 (partial), or 2 (demonstrated) for each of: outcome achieved, facts verified, sensitive-data care, error handling, and reproducibility. A score out of 10 is a learning checkpoint, not a guarantee of performance.


## Launch evidence
A preview, repository commit, script, or draft workbook is not proof of filmed videos, paid delivery, student access, or production launch. Do not claim enrollment or completion until an independent student can use the materials end to end.