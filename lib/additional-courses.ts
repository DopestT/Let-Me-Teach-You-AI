/**
 * Review-only curriculum authored for the LMTYAI course-completion workstream.
 * All names, examples and exercises are educational; no paid enrollment or live deployment is implied.
 */
export type WorkbookQuiz = { question: string; options: string[]; answer: number; explanation: string };
export type NewCourseLesson = {
  slug: string; title: string; objective: string;
  concepts: { heading: string; body: string }[];
  demo: { before: string; after: string; verify: string };
  exercise: string[];
  quiz: WorkbookQuiz;
  video: { opening: string; screen: string; close: string };
};
export type NewCourse = {
  slug: string; title: string; level: string; estimatedMinutes: number;
  description: string; outcome: string; lessons: NewCourseLesson[];
};

export const additionalCourses: NewCourse[] = [
  {
    "slug": "ai-basics-for-everyday-work",
    "title": "AI Basics for Everyday Work",
    "level": "Beginner",
    "estimatedMinutes": 125,
    "description": "Use AI safely for writing, research, planning, and everyday decisions without confusing fluent output with verified truth.",
    "outcome": "A reusable, human-reviewed five-step work routine with real deliverables.",
    "lessons": [
      {
        "slug": "know-what-ai-can-do",
        "title": "Understand AI without the hype",
        "objective": "Explain the difference between useful drafting and verified knowledge.",
        "concepts": [
          {
            "heading": "Understand the principle",
            "body": "A language model predicts useful language from patterns. It can organize, draft, classify, and transform material, but convincing wording is not evidence that a statement is true. For factual or high-stakes decisions, compare the response with trustworthy original sources."
          },
          {
            "heading": "Use the method",
            "body": "Sort tasks into low-risk drafts (ideas, outlines, formatting) and verification-required outputs (dates, prices, legal/health claims, statistics, citations). Remove private identifiers unless a specifically authorized tool and purpose require them."
          }
        ],
        "demo": {
          "before": "Tell me everything about my customer and guarantee this is correct.",
          "after": "Using only the fictional case below, write three possible ways to explain our product. Label assumptions, do not invent customer testimony, and list facts I must verify.",
          "verify": "The response contains no invented testimonials, promises, or unsourced factual claims."
        },
        "exercise": [
          "Pick a task you do twice a week and mark what AI may draft versus what you must check.",
          "Give an AI tool a fictional example; identify at least three plausible-sounding unsupported statements.",
          "Create a red/yellow/green risk checklist for your task."
        ],
        "quiz": {
          "question": "Which output needs independent verification?",
          "options": [
            "A made-up slogan for a fictional bakery",
            "A precise government filing deadline",
            "A brainstorming list of color themes"
          ],
          "answer": 1,
          "explanation": "A filing deadline is a factual claim with consequences. Check it in an official up-to-date source."
        },
        "video": {
          "opening": "AI sounds confident even when uncertain. Watch me separate a helpful draft from a claim requiring proof.",
          "screen": "Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.",
          "close": "Pause and complete the exercise; keep your evidence and revisit anything the tool guessed."
        }
      },
      {
        "slug": "ask-for-the-right-result",
        "title": "Give useful instructions",
        "objective": "Write a clear prompt with goal, audience, inputs, constraints, and output format.",
        "concepts": [
          {
            "heading": "Understand the principle",
            "body": "'Write an email' omits the recipient, purpose, relevant facts, tone, and length. Better instructions reduce revisions but cannot force truth. The most important part is the real outcome: what the human needs to do next."
          },
          {
            "heading": "Use the method",
            "body": "Use GOAL → AUDIENCE → CONTEXT → RULES → FORMAT → CHECK. Supply only facts you can share. Ask the model to call out missing information rather than quietly invent it."
          }
        ],
        "demo": {
          "before": "Write an email about the meeting.",
          "after": "Draft a 120-word friendly email to our volunteer team. Goal: confirm Tuesday at 4 PM (time provided as example). Use only the attached agenda summary; state that the location is not yet confirmed. End by asking for accessibility needs.",
          "verify": "The email uses the specified fictional time and leaves location unresolved instead of making one up."
        },
        "exercise": [
          "Rewrite one vague instruction using all six prompt fields.",
          "Test the original and improved prompt with the same fictional data.",
          "Record two differences and one remaining human check."
        ],
        "quiz": {
          "question": "What should you do if an important input is missing?",
          "options": [
            "Ask the AI to invent something credible",
            "Tell the AI to flag the missing information",
            "Assume it was in an earlier conversation"
          ],
          "answer": 1,
          "explanation": "Explicit unknowns protect the user from fabricated facts."
        },
        "video": {
          "opening": "A five-second change to the prompt can save a round of fixes.",
          "screen": "Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.",
          "close": "Pause and complete the exercise; keep your evidence and revisit anything the tool guessed."
        }
      },
      {
        "slug": "draft-with-human-judgment",
        "title": "Edit writing rather than surrendering it",
        "objective": "Produce and revise a clear message while preserving your own meaning.",
        "concepts": [
          {
            "heading": "Understand the principle",
            "body": "AI drafts are proposals. The owner of the message remains responsible for facts, promises, tone, and recipients. A polished message that changes the decision is a failure."
          },
          {
            "heading": "Use the method",
            "body": "First ask for a draft. Then ask for a change log: what was condensed, reordered, or inferred. Compare against your original facts; restore anything misrepresented. Keep private contact details out of exercises."
          }
        ],
        "demo": {
          "before": "Make my cancellation request sound smart and say the company already agreed.",
          "after": "Rewrite this cancellation request so it is concise and firm. Facts: I requested cancellation on Monday; confirmation is pending. Do not claim approval or a refund. Mark anything that needs a date or account-specific check.",
          "verify": "The revision does not invent cancellation approval, a refund, or an unprovided deadline."
        },
        "exercise": [
          "Write a five-sentence message with two facts and one unresolved item.",
          "Use AI to revise it in two distinct tones; inspect both against the original.",
          "Choose one and annotate every factual assertion before sending."
        ],
        "quiz": {
          "question": "What is the best proof that a rewritten email preserves your intent?",
          "options": [
            "It is longer",
            "Its assertions match your provided facts",
            "It sounds more authoritative"
          ],
          "answer": 1,
          "explanation": "Fidelity to the facts and the user's decision matters more than style."
        },
        "video": {
          "opening": "The best AI editor helps you communicate without putting words in your mouth.",
          "screen": "Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.",
          "close": "Pause and complete the exercise; keep your evidence and revisit anything the tool guessed."
        }
      },
      {
        "slug": "research-and-summarize",
        "title": "Summarize sources without invented evidence",
        "objective": "Separate a source's claims from your analysis and unknowns.",
        "concepts": [
          {
            "heading": "Understand the principle",
            "body": "A summary is only as reliable as its input. Do not ask a model to 'find a citation' for an unsupported claim. Give it actual excerpts or source links when supported, and verify quotations, numbers, dates, and context in the original."
          },
          {
            "heading": "Use the method",
            "body": "Use a two-column notes table: What the source actually says; What I infer. Ask for the key claim, supporting excerpt, date, and a question that remains unresolved. Two sources repeating one press release are not independent evidence."
          }
        ],
        "demo": {
          "before": "Prove the new tool is the most accurate on the market.",
          "after": "Summarize these two supplied product notes. For each, list exact stated capabilities, limits, and what cannot be compared because neither note gives benchmark methods. Do not invent test scores or customer feedback.",
          "verify": "Every conclusion can be traced to the supplied material; unsupported comparisons are labeled unknown."
        },
        "exercise": [
          "Find two public primary sources about a low-stakes topic; record publication dates.",
          "Draft a source-grounded summary and check five sentences manually.",
          "Circle one assumption and write a follow-up evidence question."
        ],
        "quiz": {
          "question": "Two articles repeat the same company announcement. What does that establish?",
          "options": [
            "Two independent confirmations",
            "A shared underlying source",
            "A controlled benchmark"
          ],
          "answer": 1,
          "explanation": "Syndicated or repeated claims do not become independent verification."
        },
        "video": {
          "opening": "AI can shorten reading time. It cannot replace checking the evidence.",
          "screen": "Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.",
          "close": "Pause and complete the exercise; keep your evidence and revisit anything the tool guessed."
        }
      },
      {
        "slug": "plan-and-complete",
        "title": "Build your personal AI work routine",
        "objective": "Finish a small weekly workflow with a result, checks, and a fallback.",
        "concepts": [
          {
            "heading": "Understand the principle",
            "body": "The useful endpoint is a finished result, not a chat transcript. Plan from the deliverable backward: what is due, what information is available, what depends on someone else, and what could go wrong."
          },
          {
            "heading": "Use the method",
            "body": "Complete one capstone: take a non-sensitive task such as a club meeting plan or fictional event, draft the materials, compare against the source facts, and prepare a checklist. Keep the final approval and sending with a person."
          }
        ],
        "demo": {
          "before": "Make a perfect event plan and automatically send it.",
          "after": "Create a one-page plan for a fictional community workshop using the supplied venue and date. Identify missing budget and accessibility details. Draft an agenda, task owners as roles not names, verification checklist, and manual fallback.",
          "verify": "The plan separates provided details from unknowns and includes a clear owner check before publication."
        },
        "exercise": [
          "Choose one workflow and state a measurable result.",
          "Use AI to draft the output, then do a source and privacy review.",
          "Save a reusable prompt, a reviewed example, and a three-line 'what I would change next time' note."
        ],
        "quiz": {
          "question": "When is this course capstone complete?",
          "options": [
            "When the model answers once",
            "When the user has a usable checked deliverable and knows its limits",
            "When the output is the longest possible"
          ],
          "answer": 1,
          "explanation": "A useful, reviewed deliverable is the completion standard."
        },
        "video": {
          "opening": "Turn the prompts into a repeatable human-owned routine.",
          "screen": "Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.",
          "close": "Pause and complete the exercise; keep your evidence and revisit anything the tool guessed."
        }
      }
    ]
  },
  {
    "slug": "prompting-for-productivity",
    "title": "Prompting for Productivity",
    "level": "Beginner to intermediate",
    "estimatedMinutes": 140,
    "description": "Design prompts you can reuse for communication, planning, research, and analysis—and improve them using evidence rather than magic phrases.",
    "outcome": "A tested mini prompt library with before/after examples, quality checks, and documented limitations.",
    "lessons": [
      {
        "slug": "state-the-job",
        "title": "Design an outcome-first prompt",
        "objective": "Turn a vague request into a task with measurable success criteria.",
        "concepts": [
          {
            "heading": "Understand the principle",
            "body": "There is no secret spell that guarantees the right answer. Successful prompts give the system a job it can actually do and an observable definition of done. Separate the source information from your preferences."
          },
          {
            "heading": "Use the method",
            "body": "Use a task card with audience, context, constraints, output schema, and test. For each requested fact, tell the model which supplied source supports it or ask it to label it as missing."
          }
        ],
        "demo": {
          "before": "Make a marketing plan for my shop.",
          "after": "Using the fictional shop description below, propose a seven-day customer feedback test. Budget: zero. Output a table with activity, audience, effort and how we will measure a real response. Do not invent sales data.",
          "verify": "The plan respects the zero-budget constraint and measures observable responses, not made-up ROI."
        },
        "exercise": [
          "Write your task as a one-sentence deliverable.",
          "Specify three constraints and two measurable tests.",
          "Compare a first draft with the improved prompt; keep both."
        ],
        "quiz": {
          "question": "Which instruction makes a prompt more testable?",
          "options": [
            "Make it amazing",
            "Provide 5 steps that fit the supplied 2-hour budget",
            "Use professional language"
          ],
          "answer": 1,
          "explanation": "A time budget and a specified output can be checked."
        },
        "video": {
          "opening": "Strong prompts start with the job, not flattery.",
          "screen": "Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.",
          "close": "Pause and complete the exercise; keep your evidence and revisit anything the tool guessed."
        }
      },
      {
        "slug": "repair-bad-output",
        "title": "Iterate without losing the facts",
        "objective": "Use critique, correction, and selective regeneration to improve a draft.",
        "concepts": [
          {
            "heading": "Understand the principle",
            "body": "When an output is wrong, repeating the same vague prompt often produces more polished errors. Diagnose the failure type: missing facts, unwanted assumptions, wrong format, unsafe action, or poor prioritization."
          },
          {
            "heading": "Use the method",
            "body": "Use a review loop: TEST → IDENTIFY → CONSTRAIN → RETEST. Quote the defective fragment, explain the violated criterion, then request only the needed change. Keep a human-readable diff."
          }
        ],
        "demo": {
          "before": "The email is too formal; redo everything and make it better.",
          "after": "Revise only the greeting and closing in the supplied draft for a friendly client tone. Keep all dates, price figures, and promises exactly as provided. Return the changed lines and a list of unchanged facts.",
          "verify": "The requested tone changes but the numerical and contractual details do not drift."
        },
        "exercise": [
          "Generate one first draft with a deliberately incomplete prompt.",
          "Mark three concrete defects and categorize them.",
          "Write a constrained repair prompt; compare both outputs line by line."
        ],
        "quiz": {
          "question": "What is a safe correction to a mostly good draft?",
          "options": [
            "Ask for a completely different answer",
            "Request a targeted revision that preserves verified facts",
            "Tell it to be more confident"
          ],
          "answer": 1,
          "explanation": "Narrow revisions reduce accidental changes to good material."
        },
        "video": {
          "opening": "You do not need a new answer when only one sentence is wrong.",
          "screen": "Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.",
          "close": "Pause and complete the exercise; keep your evidence and revisit anything the tool guessed."
        }
      },
      {
        "slug": "ground-research",
        "title": "Prompt for evidence-aware analysis",
        "objective": "Produce a traceable research table with explicit unknowns.",
        "concepts": [
          {
            "heading": "Understand the principle",
            "body": "Models can invent links, quotations, and studies. A good research prompt requests original sources where tools support browsing and a clear separation between citation, paraphrase, inference, and open question."
          },
          {
            "heading": "Use the method",
            "body": "Ask for a claim table with source title, URL, source date, event date, exact support, and reliability notes. Then open primary materials yourself. If browsing is not available, require 'source unavailable' rather than fabricated citations."
          }
        ],
        "demo": {
          "before": "Find six studies proving my preferred answer.",
          "after": "Compare only the three supplied study abstracts on their stated populations, methods, outcomes, and limitations. List what cannot be concluded from abstracts alone. Add no invented numbers or references.",
          "verify": "Every cited detail is actually visible in the supplied abstracts; disagreement is preserved."
        },
        "exercise": [
          "Gather two primary sources and one secondary summary.",
          "Make a claim/evidence/uncertainty matrix.",
          "Independently recheck at least two dates and two numeric claims."
        ],
        "quiz": {
          "question": "What should appear when the requested study is not provided or accessible?",
          "options": [
            "A plausible citation",
            "An explicit evidence gap",
            "A confident summary from memory"
          ],
          "answer": 1,
          "explanation": "A missing source must be reported, not fabricated."
        },
        "video": {
          "opening": "Citations are evidence only if they really point to the claim.",
          "screen": "Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.",
          "close": "Pause and complete the exercise; keep your evidence and revisit anything the tool guessed."
        }
      },
      {
        "slug": "reusable-templates",
        "title": "Turn a successful prompt into a reusable template",
        "objective": "Build a template with fields, examples, stop rules, and verification steps.",
        "concepts": [
          {
            "heading": "Understand the principle",
            "body": "A good reusable prompt is a little procedure, not a wall of words. It tells a future user what to supply, when the system should ask for missing data, and how to judge the result."
          },
          {
            "heading": "Use the method",
            "body": "Create three templates: communication, planning, and analysis. Use [GOAL], [AUDIENCE], [FACTS], [CONSTRAINTS], [OUTPUT], and [CHECKS] placeholders. Include one filled example but no real personal data."
          }
        ],
        "demo": {
          "before": "Each time, remember everything about my business and do the right thing.",
          "after": "Template: [GOAL]. Audience: [AUDIENCE]. Verified facts: [FACTS]. Constraints: [CONSTRAINTS]. Output: [OUTPUT]. If an essential fact is missing, mark it unknown before writing. Self-check: [CHECKS].",
          "verify": "Another learner can use the template without needing access to your previous chats."
        },
        "exercise": [
          "Create a communication template and fill in a fictional example.",
          "Create a planning template and specify error checks.",
          "Create an analysis template that requires source evidence and uncertainty labels."
        ],
        "quiz": {
          "question": "A reusable template should primarily contain...",
          "options": [
            "Hidden assumptions",
            "Clear input slots and validation checks",
            "A demand for certainty"
          ],
          "answer": 1,
          "explanation": "Inputs and tests make prompts transferable."
        },
        "video": {
          "opening": "Turn a good one-off prompt into a tool another person can use.",
          "screen": "Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.",
          "close": "Pause and complete the exercise; keep your evidence and revisit anything the tool guessed."
        }
      },
      {
        "slug": "prompt-library-capstone",
        "title": "Evaluate and ship a prompt library",
        "objective": "Deliver three tested prompts with examples and a scorecard.",
        "concepts": [
          {
            "heading": "Understand the principle",
            "body": "A prompt library is only valuable if it reliably helps real people finish a task. Keep the original failure alongside the improved version so the improvement is inspectable. Avoid claiming accuracy improvements without measurements."
          },
          {
            "heading": "Use the method",
            "body": "Test each template twice on different safe inputs. Score factual fidelity, task completion, format, missing-data handling, privacy, and ease of editing from 0–2. A 10/12 is not a magic guarantee; record defects and retest."
          }
        ],
        "demo": {
          "before": "These are my ultimate prompts; they always work.",
          "after": "For each of my three templates, create two fictional test cases, describe expected output, compare against the six checks, and list one failure case. Give me a change log, not a claim of perfection.",
          "verify": "The library includes three prompts, six tests, visible scoring, and limitations."
        },
        "exercise": [
          "Package three final prompts with short usage instructions.",
          "Run two tests per prompt; record before/after and scores.",
          "Share only safe examples and identify any human approval needed for real use."
        ],
        "quiz": {
          "question": "What counts as measured prompt improvement?",
          "options": [
            "The response looks nicer",
            "It passes more predefined tests on comparable inputs",
            "It is longer"
          ],
          "answer": 1,
          "explanation": "Evaluate against the same observable criteria before claiming improvement."
        },
        "video": {
          "opening": "Finish with prompts that have earned their place in your toolkit.",
          "screen": "Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.",
          "close": "Pause and complete the exercise; keep your evidence and revisit anything the tool guessed."
        }
      }
    ]
  },
  {
    "slug": "ai-workflow-lab",
    "title": "AI Workflow Lab",
    "level": "Intermediate beginner",
    "estimatedMinutes": 165,
    "description": "Build a practical, observable AI-assisted workflow with privacy checks, human approval, failure handling, and a capstone rubric.",
    "outcome": "A repeatable workflow specification, test log, and pilot-ready manual fallback.",
    "lessons": [
      {
        "slug": "map-the-process",
        "title": "Map one real process",
        "objective": "Document a trigger, input, decision, owner, result, and log before choosing software.",
        "concepts": [
          {
            "heading": "Understand the principle",
            "body": "Automating an unclear process makes unclear mistakes happen faster. Start with a task already performed manually: intake, classify, draft, review, send. Record who owns each step."
          },
          {
            "heading": "Use the method",
            "body": "Draw trigger → validate → AI transformation → human review → action → evidence log. Name the data you are allowed to use and what must never enter the model."
          }
        ],
        "demo": {
          "before": "Automate my entire business.",
          "after": "For fictional volunteer inquiries: when a form arrives, validate name and question, classify topic, draft a reply, hold for organizer approval, then record whether a response was sent.",
          "verify": "Every step has an owner and the final action waits for approval."
        },
        "exercise": [
          "Choose one repeated task and time three manual runs.",
          "Draw each step and label inputs, outputs, and people.",
          "Identify one step to automate and one step to retain manually."
        ],
        "quiz": {
          "question": "What should you automate first?",
          "options": [
            "An undefined process with many exceptions",
            "One narrow repeated step with observable output",
            "All production decisions at once"
          ],
          "answer": 1,
          "explanation": "A bounded step is easier to test and reverse."
        },
        "video": {
          "opening": "A map of the process is more valuable than an automation screenshot.",
          "screen": "Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.",
          "close": "Pause and complete the exercise; keep your evidence and revisit anything the tool guessed."
        }
      },
      {
        "slug": "design-the-data-contract",
        "title": "Validate inputs and outputs",
        "objective": "Define exactly what the automation accepts, rejects, and records.",
        "concepts": [
          {
            "heading": "Understand the principle",
            "body": "Models are not validators. Validate required fields before sending input; bound lengths; reject unexpected formats; minimize personal data. Treat model output as untrusted until checked."
          },
          {
            "heading": "Use the method",
            "body": "Define a small contract: request_id, category, non-sensitive summary, status, and reviewer approval. Test empty, duplicate, overlong, and instruction-injection-like text. Never let source text override workflow policy."
          }
        ],
        "demo": {
          "before": "Take any input and send an email automatically.",
          "after": "Accept a fictional inquiry only if category is from the allowlist and summary has a maximum size; create a draft response and status 'needs_review'. If data are invalid, return 'needs_manual_attention' without sending.",
          "verify": "Invalid or malicious-looking inputs cannot directly trigger an external action."
        },
        "exercise": [
          "Write five sample records: normal, missing, duplicate, unusual, malicious instruction.",
          "State validation rules and expected outcomes for each.",
          "Create a manual exception queue and privacy retention note."
        ],
        "quiz": {
          "question": "Which is a correct use of model-generated output?",
          "options": [
            "Treat it as a trusted command",
            "Validate it before downstream action",
            "Give it direct production access"
          ],
          "answer": 1,
          "explanation": "AI output is untrusted input to the next step."
        },
        "video": {
          "opening": "A reliable workflow knows what to do when input is wrong.",
          "screen": "Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.",
          "close": "Pause and complete the exercise; keep your evidence and revisit anything the tool guessed."
        }
      },
      {
        "slug": "add-review-and-fallback",
        "title": "Design an approval gate",
        "objective": "Keep consequential actions under human control and preserve a manual fallback.",
        "concepts": [
          {
            "heading": "Understand the principle",
            "body": "The goal is fewer repetitive steps, not an unaccountable system. If a workflow might contact customers, publish, spend, erase, or mutate production data, require an authorized reviewer until controlled evidence supports any change."
          },
          {
            "heading": "Use the method",
            "body": "Design a draft queue with Approve / Edit / Reject options. The action should only execute on an approved record, with deduplication and a short event log. Define what happens when the model or API fails."
          }
        ],
        "demo": {
          "before": "If the AI says the answer is good, send it to everyone.",
          "after": "Create a draft and hold it for review. If approval is absent, the system must not send. If the provider is offline, put the item in a human queue and log a non-sensitive error code.",
          "verify": "A simulated failed review prevents sends and retains the draft for manual action."
        },
        "exercise": [
          "Write the approval requirement as an explicit state rule.",
          "Describe a failure scenario and how the human completes the task.",
          "List the minimum log fields without storing unnecessary secrets."
        ],
        "quiz": {
          "question": "What happens when the reviewer has not approved a customer email?",
          "options": [
            "Send it after five minutes",
            "Keep it as a draft",
            "Ask the AI to approve itself"
          ],
          "answer": 1,
          "explanation": "No approval means no consequential action."
        },
        "video": {
          "opening": "An approval gate is a product feature, not a slowdown.",
          "screen": "Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.",
          "close": "Pause and complete the exercise; keep your evidence and revisit anything the tool guessed."
        }
      },
      {
        "slug": "test-and-observe",
        "title": "Test the entire workflow",
        "objective": "Run normal, error, duplicate, and adversarial tests against expected results.",
        "concepts": [
          {
            "heading": "Understand the principle",
            "body": "A green build means code compiled, not that the workflow produced the intended real-world outcome. Define an acceptance matrix and collect actual observations for each test."
          },
          {
            "heading": "Use the method",
            "body": "For each test record input type, expected behavior, observed result, evidence link, and pass/fail. Include a privacy check and a restart/retry case. Avoid logging raw personal content."
          }
        ],
        "demo": {
          "before": "Looks good. Ship it.",
          "after": "Run seven sandbox cases with labeled synthetic data: normal, missing field, duplicate, long input, API failure, false approval, and retry. Report each expected result against observed logs, then identify defects.",
          "verify": "The evidence shows whether state transitions and final actions matched the test contract."
        },
        "exercise": [
          "Create seven expected-result cases before running the system.",
          "Test locally with synthetic records; do not use real customer inboxes.",
          "Fix one observed failure and rerun its case, then record the evidence."
        ],
        "quiz": {
          "question": "What does a passing unit test prove?",
          "options": [
            "Every real customer can use the system",
            "That specific test passed under its conditions",
            "The workflow is legally compliant"
          ],
          "answer": 1,
          "explanation": "Each test supports only the behavior it exercised."
        },
        "video": {
          "opening": "Good automation tests are evidence, not green decorations.",
          "screen": "Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.",
          "close": "Pause and complete the exercise; keep your evidence and revisit anything the tool guessed."
        }
      },
      {
        "slug": "pilot-and-handoff",
        "title": "Finish a controlled workflow pilot",
        "objective": "Package a safe pilot with manual operating instructions and a measurable outcome.",
        "concepts": [
          {
            "heading": "Understand the principle",
            "body": "A pilot is done when a real, authorized user can complete the job and recover from errors. Local tests are necessary but insufficient. Separate pilot evidence from a production launch decision."
          },
          {
            "heading": "Use the method",
            "body": "Create a handoff containing process map, data contract, prompt, approval rule, seven-case matrix, rollback/manual fallback, and a scorecard. Run an authorized small-scale pilot only after separate permission."
          }
        ],
        "demo": {
          "before": "Our agent is built, so it is live and successful.",
          "after": "We have a draft-only workflow with seven synthetic tests. Production delivery and real-user acceptance remain unverified. Next gate: review a restricted pilot plan and explicitly approve any live integrations.",
          "verify": "The handoff is honest about what is tested versus merely designed."
        },
        "exercise": [
          "Assemble the process map, contract, test matrix, and manual fallback.",
          "Score reliability (0–4), privacy (0–4), clarity (0–4), and evidence (0–4).",
          "List remaining approvals and the smallest safe real-user test."
        ],
        "quiz": {
          "question": "When is an automated service actually done?",
          "options": [
            "When a bot says success",
            "When an authorized user can complete the intended job with evidence",
            "When the design is attractive"
          ],
          "answer": 1,
          "explanation": "The user-complete outcome is the standard, not the existence of code."
        },
        "video": {
          "opening": "End with a workflow someone can trust, test and operate.",
          "screen": "Show the weak version, revise the input in front of the learner, then inspect the result against the stated goal.",
          "close": "Pause and complete the exercise; keep your evidence and revisit anything the tool guessed."
        }
      }
    ]
  }
];

export const getAdditionalCourse = (slug: string) => additionalCourses.find(course => course.slug === slug);
export const getAdditionalLesson = (courseSlug: string, lessonSlug: string) => getAdditionalCourse(courseSlug)?.lessons.find(lesson => lesson.slug === lessonSlug);
