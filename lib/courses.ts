export type CourseLesson = {
  slug: string;
  number: number;
  title: string;
  summary: string;
  outcome: string;
  sections: { heading: string; body: string }[];
  actions: string[];
  prompt: string;
};

export const aiBusinessCourse = {
  slug: "build-an-ai-business-from-scratch",
  title: "Build an AI Business From Scratch",
  eyebrow: "Flagship course · Beginner friendly",
  description:
    "Go from a useful idea to a simple brand, a working site, a repeatable content engine, an automation system, and a realistic path to revenue.",
  promise:
    "By the end, you will have a small AI-assisted business system you can actually test with real people instead of a folder full of ideas.",
  lessons: [
    {
      slug: "choose-the-idea",
      number: 1,
      title: "Choose the idea",
      summary: "Start with a real problem, a specific person, and a simple paid outcome.",
      outcome: "A one-sentence business concept with a target customer, problem, offer, and first test.",
      sections: [
        {
          heading: "Start with pain, not AI",
          body: "Do not begin with ‘What can I build with AI?’ Begin with ‘What annoying, expensive, slow, confusing, or repetitive problem already exists?’ AI is useful when it makes the solution faster, cheaper, clearer, or easier to deliver. The business is the solved problem, not the model behind it.",
        },
        {
          heading: "Narrow the customer",
          body: "A broad audience makes every decision harder. Pick one group you can describe plainly: local contractors who miss leads, creators who hate clipping videos, small shops that need product descriptions, or busy professionals who need research summarized. You can expand later after one group responds.",
        },
        {
          heading: "Define one outcome",
          body: "The first offer should produce one visible result. Examples: ‘turn every form submission into an approved follow-up,’ ‘turn one long video into ten short clips,’ or ‘turn a messy idea into a launch-ready landing page.’ Avoid selling vague access to AI. Sell the result someone can judge.",
        },
        {
          heading: "Run a cheap reality test",
          body: "Before building a full product, show the offer to real people. Ask whether they would use it, what they do now, what they dislike about the current process, and what would make the result worth paying for. Five useful conversations beat fifty imagined features.",
        },
      ],
      actions: [
        "Write down three problems you personally understand.",
        "Choose one narrow customer group for each problem.",
        "Turn the strongest option into: We help [person] get [result] without [pain].",
        "Ask five real people how they solve that problem today.",
        "Keep the idea only if the problem is real enough to deserve another week of work.",
      ],
      prompt:
        "Act as a practical business coach. I will give you three problems I understand. Help me score each one for urgency, frequency, willingness to pay, ease of reaching customers, and how much AI can improve delivery. Then recommend one tiny offer I can test this week. Do not invent demand; tell me what I still need to validate.",
    },
    {
      slug: "build-the-brand-and-site",
      number: 2,
      title: "Build the brand and site",
      summary: "Turn the idea into a clear identity and a website that explains the offer in seconds.",
      outcome: "A simple brand, domain direction, homepage structure, and working first version of the site.",
      sections: [
        {
          heading: "Make the name support the promise",
          body: "A good early-stage name is easy to say, easy to spell, and flexible enough to grow. It does not need to explain every feature. The homepage headline and subhead can do the explaining. Avoid spending days on a clever name while the offer itself is still fuzzy.",
        },
        {
          heading: "Build the homepage around one decision",
          body: "Your homepage should answer four questions quickly: What is this? Who is it for? What result do I get? What should I do next? A clean page with one strong call to action usually beats a complicated site full of empty sections.",
        },
        {
          heading: "Use AI as a builder, not a taste substitute",
          body: "AI can generate copy, layouts, code, icons, and variants quickly. You still need to decide what feels trustworthy, what is unnecessary, and whether every button goes somewhere real. Use AI to accelerate iterations, then audit the result on desktop and mobile like a customer would.",
        },
        {
          heading: "Ship the smallest credible version",
          body: "For the first version you need a real domain, a clear offer, a way to contact or sign up, basic trust pages, and working navigation. You do not need a giant dashboard, ten pricing tiers, or every future feature. Credibility comes from clarity and things actually working.",
        },
      ],
      actions: [
        "Write a one-line brand promise and a one-line description.",
        "Sketch a homepage with hero, proof or explanation, offer, CTA, and footer.",
        "Build the page with your preferred AI website tool or coding assistant.",
        "Click every link and submit every form yourself.",
        "Test the page on a phone before adding more sections.",
      ],
      prompt:
        "Turn this business concept into a launch-ready website brief. Give me: a clear homepage headline, subhead, one primary CTA, the minimum sections I need, the trust pages I need, and a mobile-first checklist. Keep the design simple and premium. Do not add features that are not necessary for the first real customer test.",
    },
    {
      slug: "create-the-content-engine",
      number: 3,
      title: "Create the content engine",
      summary: "Turn what you know and build into repeatable content that attracts the right people.",
      outcome: "Three content pillars, a reusable production template, and a first week of posts tied to the offer.",
      sections: [
        {
          heading: "Teach the problem you solve",
          body: "Useful content should make the right customer think, ‘They understand my problem.’ Explain mistakes, show before-and-after workflows, answer common questions, and document what you are building. Content works better when it demonstrates competence instead of constantly announcing that you are selling something.",
        },
        {
          heading: "Use three simple content pillars",
          body: "A strong starter system is: teach, show, invite. Teach something useful about the problem. Show a build, result, test, or behind-the-scenes process. Invite the audience to try the tool, download something, join the list, or reply. Those three modes can produce weeks of content without inventing a new strategy every day.",
        },
        {
          heading: "Create once, adapt by platform",
          body: "Start with one useful idea and make platform-specific versions instead of creating unrelated posts everywhere. A walkthrough can become a short video, a carousel, an X thread, a newsletter section, and a website lesson. The message stays consistent while the format changes.",
        },
        {
          heading: "Make every CTA earn its place",
          body: "Not every post needs a hard sell. Some posts should simply be useful. When you do ask for an action, make it specific: get the checklist, try the helper, join the free newsletter, or see the full build. A clear next step is better than ‘link in bio’ with no reason to click.",
        },
      ],
      actions: [
        "Choose three recurring content pillars: teach, show, invite.",
        "List ten questions your target customer already asks.",
        "Turn one question into a short video, text post, and carousel outline.",
        "Attach one useful CTA to the content where it naturally fits.",
        "Schedule one week before trying to automate a month.",
      ],
      prompt:
        "Create a seven-day content plan for this business. Use only three pillars: Teach, Show, Invite. Each day should have one core idea, a short-form video hook, a text-post version, and the most natural CTA. Keep the content genuinely useful and avoid guru-style hype.",
    },
    {
      slug: "automate-the-workflow",
      number: 4,
      title: "Automate the workflow",
      summary: "Connect the repetitive parts without giving automation control over risky decisions too early.",
      outcome: "One production workflow with a trigger, validation, AI step, approval gate, action, and log.",
      sections: [
        {
          heading: "Automate a repeated process, not your imagination",
          body: "The easiest automation to build is a process you have already done manually. Write down the trigger, inputs, decisions, actions, and result. If you cannot explain the process in normal language, the automation will probably become a pile of disconnected nodes.",
        },
        {
          heading: "Give AI one narrow job at a time",
          body: "AI steps are easier to test when they summarize, classify, extract, rewrite, or choose from a controlled set. Avoid one giant prompt that is expected to understand the business, make every decision, publish publicly, and recover from mistakes. Small jobs create observable workflows.",
        },
        {
          heading: "Keep an approval gate around consequences",
          body: "If a step can send to customers, spend money, publish publicly, delete data, or change an important record, keep a human checkpoint until the workflow has earned trust. Automation should remove repetition before it removes judgment.",
        },
        {
          heading: "Log enough to debug",
          body: "Every useful workflow should leave a trail: what triggered it, what data entered, what AI returned, what action happened, and whether it succeeded. Logs turn failures into fixable problems instead of mysteries.",
        },
      ],
      actions: [
        "Pick one process you performed manually at least twice this week.",
        "Write it as trigger → validate → AI job → approval → action → log.",
        "Build the first version in n8n, Make, or another automation tool.",
        "Run normal, missing-data, duplicate, and weird-input tests.",
        "Do not remove the human gate until the failure cases are boring.",
      ],
      prompt:
        "Help me design this automation before I build it. Convert my process into: trigger, required inputs, validation rules, one narrow AI task, decision rules, human approval point, final action, and logging fields. Then give me five test cases including at least two failure cases. Keep risky actions behind approval.",
    },
    {
      slug: "turn-it-into-income",
      number: 5,
      title: "Turn it into income",
      summary: "Package the working system into a simple offer and test whether people will pay for the outcome.",
      outcome: "A starter offer, price hypothesis, sales message, and 30-day validation plan.",
      sections: [
        {
          heading: "Charge for the outcome",
          body: "Customers do not care how many prompts, models, or automation nodes you used. They care whether the result saves time, makes money, reduces mistakes, creates something useful, or removes a recurring headache. Price the value of the solved problem, then make sure your delivery cost leaves room to operate.",
        },
        {
          heading: "Start with one simple offer",
          body: "Early pricing should be easy to understand. A setup fee, a monthly service, a fixed package, or a simple subscription is easier to test than six confusing tiers. You can add complexity after customers teach you what they actually need.",
        },
        {
          heading: "Sell manually before automating sales",
          body: "Your first conversations are research. Talk to prospects, send the offer directly, answer objections, and notice which words make people understand the value fastest. Do not automate a sales process you have not yet proven manually.",
        },
        {
          heading: "Track the small numbers that matter",
          body: "For the first month, track people reached, conversations started, demos or trials, customers, revenue, delivery time, and cancellations or objections. A tiny business with clear numbers is easier to improve than a large audience with no idea what converts.",
        },
      ],
      actions: [
        "Package the result into one starter offer with one price hypothesis.",
        "Write a short sales message that describes the customer, problem, result, and next step.",
        "Reach out to ten qualified prospects manually.",
        "Track objections instead of arguing with them.",
        "At day 30, decide whether to improve the offer, change the audience, or stop the test.",
      ],
      prompt:
        "Turn this working AI-assisted service into one simple starter offer. Give me a value proposition, what is included, what is explicitly not included, a reasonable price-testing range, a short outreach message, and the seven numbers I should track for 30 days. Keep the offer easy to understand and do not promise unrealistic income.",
    },
  ] satisfies CourseLesson[],
};

export function getAiBusinessLesson(slug: string) {
  return aiBusinessCourse.lessons.find((lesson) => lesson.slug === slug);
}
