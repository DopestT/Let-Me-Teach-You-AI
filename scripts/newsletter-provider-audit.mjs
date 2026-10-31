import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const newsletterPath = path.join(root, "lib", "newsletter.ts");
const envExamplePath = path.join(root, ".env.example");
const healthPath = path.join(root, "app", "api", "newsletter-health", "route.ts");

const newsletter = fs.readFileSync(newsletterPath, "utf8");
const envExample = fs.readFileSync(envExamplePath, "utf8");
const health = fs.readFileSync(healthPath, "utf8");

const checks = [
  [!newsletter.includes("api.beehiiv.com"), "newsletter integration must not call Beehiiv"],
  [newsletter.includes("https://api.brevo.com/v3"), "newsletter integration must target Brevo v3"],
  [newsletter.includes('"api-key"'), "Brevo API key must be sent with the api-key header"],
  [newsletter.includes("listIds"), "Brevo contact creation must enroll the subscriber in the configured list"],
  [newsletter.includes("updateEnabled"), "Brevo contact creation must safely handle existing contacts"],
  [envExample.includes("Newsletter provider (Brevo)"), ".env.example must document Brevo as the permanent provider"],
  [envExample.includes("Brevo List ID"), "NEWSLETTER_AUDIENCE_ID must be documented as the Brevo List ID"],
  [!envExample.includes("Beehiiv Publication ID"), ".env.example must not describe NEWSLETTER_AUDIENCE_ID as a Beehiiv publication"],
  [health.includes('provider: "brevo"'), "newsletter health must report Brevo as the provider"],
  [health.includes("listIdConfigured"), "newsletter health must report list configuration"],
  [!health.includes("NEWSLETTER_WELCOME_AUTOMATION_ID"), "newsletter health must not depend on a Beehiiv automation id"],
];

const failures = checks.filter(([ok]) => !ok).map(([, message]) => message);

if (failures.length) {
  console.error("Newsletter provider audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Newsletter provider audit passed: Brevo contract is locked.");
