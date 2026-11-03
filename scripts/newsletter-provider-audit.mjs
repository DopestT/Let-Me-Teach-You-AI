import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const newsletter = read("lib/newsletter.ts");
const envExample = read(".env.example");
const health = read("app/api/newsletter-health/route.ts");
const automations = read("app/api/newsletter-automations/route.ts");
const readme = read("README.md");
const deployment = read("DEPLOYMENT.md");
const privacy = read("app/privacy/page.tsx");
const welcomeSequence = read("content/welcome-sequence.md");
const subscribers = read("lib/subscribers.ts");
const contactRoute = read("app/api/contact/route.ts");

const checks = [
  [!newsletter.includes("api.beehiiv.com"), "newsletter integration must not call Beehiiv"],
  [newsletter.includes("https://api.brevo.com/v3"), "newsletter integration must target Brevo v3"],
  [newsletter.includes('"api-key"'), "Brevo API key must be sent with the api-key header"],
  [newsletter.includes("listIds"), "Brevo contact creation must enroll the subscriber in the configured list"],
  [newsletter.includes("updateEnabled"), "Brevo contact creation must safely handle existing contacts"],
  [newsletter.includes("/smtp/email"), "successful signup must send the AI Work Kit through Brevo transactional email"],
  [newsletter.includes("hello@letmeteachyouai.com"), "welcome email must use the authenticated LMTYAI sender"],
  [newsletter.includes("AI Work Kit"), "welcome email must identify the AI Work Kit"],
  [newsletter.includes("/api/prompt-pack"), "welcome email must include the direct Work Kit download"],
  [newsletter.includes("/learn/build-an-ai-business-from-scratch"), "welcome email must include Course 1"],
  [envExample.includes("Newsletter provider (Brevo)"), ".env.example must document Brevo as the permanent provider"],
  [envExample.includes("Brevo List ID"), "NEWSLETTER_AUDIENCE_ID must be documented as the Brevo List ID"],
  [!envExample.includes("Beehiiv Publication ID"), ".env.example must not describe NEWSLETTER_AUDIENCE_ID as a Beehiiv publication"],
  [health.includes('provider: "brevo"'), "newsletter health must report Brevo as the provider"],
  [health.includes("listIdConfigured"), "newsletter health must report list configuration"],
  [!health.includes("NEWSLETTER_WELCOME_AUTOMATION_ID"), "newsletter health must not depend on a Beehiiv automation id"],
  [!automations.includes("api.beehiiv.com"), "newsletter automations endpoint must not call Beehiiv"],
  [automations.includes('provider: "brevo"'), "newsletter automations endpoint must report Brevo"],
  [readme.includes("Email / newsletter:** Brevo"), "README must identify Brevo as the email/newsletter provider"],
  [!readme.includes("Beehiiv for subscriptions"), "README stack must not describe Beehiiv as active infrastructure"],
  [deployment.includes("Brevo API key"), "deployment guide must document NEWSLETTER_API_KEY as Brevo"],
  [!deployment.includes("Beehiiv Publication ID"), "deployment guide must not describe NEWSLETTER_AUDIENCE_ID as Beehiiv"],
  [privacy.includes("We use Brevo"), "privacy policy must disclose Brevo as the newsletter provider"],
  [!privacy.includes("We use Beehiiv"), "privacy policy must not disclose Beehiiv as the active provider"],
  [welcomeSequence.includes("Brevo"), "welcome sequence operations must reference Brevo"],
  [!welcomeSequence.includes("Beehiiv Automation"), "welcome sequence must not instruct operators to configure Beehiiv"],
  [!subscribers.includes("newsletter sender (Beehiiv)"), "subscriber ledger comments must not describe Beehiiv as the sender"],
  [!contactRoute.includes("Beehiiv reply-to"), "contact route comments must not describe Beehiiv as the email provider"],
];

const failures = checks.filter(([ok]) => !ok).map(([, message]) => message);

if (failures.length) {
  console.error("Newsletter provider audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Newsletter provider audit passed: Brevo signup, welcome delivery, runtime endpoints, and operational docs are aligned.");
