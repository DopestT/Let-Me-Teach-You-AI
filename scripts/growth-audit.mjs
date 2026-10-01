import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

function walk(dir) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full, { withFileTypes: true }).flatMap((entry) => {
    const rel = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(rel) : [rel];
  });
}

const sourceFiles = [...walk("app"), ...walk("components"), ...walk("lib")].filter((p) => /\.(ts|tsx)$/.test(p));
for (const file of sourceFiles) {
  const body = read(file);
  if (body.includes("https://www.letmeteachyouai.com")) errors.push(file + ": hard-coded www canonical host");
}

const hasStaticLlms = fs.existsSync(path.join(root, "public/llms.txt"));
const hasDynamicLlms = fs.existsSync(path.join(root, "app/llms.txt/route.ts"));
if (hasStaticLlms && hasDynamicLlms) errors.push("llms.txt: static and dynamic implementations collide");
if (fs.existsSync(path.join(root, "GROWTH_OPERATOR.md"))) {
  const operatorDoc = read("GROWTH_OPERATOR.md");
  if (operatorDoc.includes("Canonical site: https://www.letmeteachyouai.com")) errors.push("GROWTH_OPERATOR.md: canonical drift to www");
}

const config = JSON.parse(read("growth/growth-config.json"));
if (config?.primaryConversion?.event !== "newsletter_signup") errors.push("growth-config: primary conversion must be newsletter_signup");
if (config?.qualityGates?.publishMode !== "review_required") errors.push("growth-config: publishing must remain review_required during baseline");

const guides = read("lib/seo-guides.ts");
const slugs = [...guides.matchAll(/\bslug:\s*"([^"]+)"/g)].map((m) => m[1]);
const keywords = [...guides.matchAll(/\bprimaryKeyword:\s*"([^"]+)"/g)].map((m) => m[1].toLowerCase());
const duplicate = (items) => [...new Set(items.filter((x, i) => items.indexOf(x) !== i))];
for (const slug of duplicate(slugs)) errors.push("duplicate guide slug: " + slug);
for (const keyword of duplicate(keywords)) errors.push("duplicate primary keyword: " + keyword);

const slugSet = new Set(slugs);
for (const match of guides.matchAll(/\brelated:\s*\[([^\]]*)\]/g)) {
  for (const q of match[1].matchAll(/"([^"]+)"/g)) {
    if (!slugSet.has(q[1])) errors.push("missing related guide target: " + q[1]);
  }
}

const guidePage = read("app/guides/[slug]/page.tsx");
if (!guidePage.includes("SignupForm compact")) errors.push("guide page: missing conversion CTA");
if (!guidePage.includes("guide:${guide.slug}")) errors.push("guide page: missing per-guide signup attribution");

const newsletter = read("lib/newsletter.ts");
if (!newsletter.includes("utm_medium: args.utmMedium")) errors.push("newsletter: utm_medium forwarding missing");
if (!newsletter.includes("utm_campaign: args.utmCampaign")) errors.push("newsletter: utm_campaign forwarding missing");
if (!newsletter.includes("utm_content: args.utmContent")) errors.push("newsletter: utm_content forwarding missing");
if (!newsletter.includes("utm_term: args.utmTerm")) errors.push("newsletter: utm_term forwarding missing");
const signupRoute = read("app/api/subscribe/route.ts");
if (!signupRoute.includes("utmMedium: attribution.utmMedium")) errors.push("subscribe route: attribution forwarding missing");
const signup = read("components/signup-form.tsx");
if (!signup.includes('track("newsletter_signup"')) errors.push("signup form: conversion event missing");
if (!signup.includes("source?: string")) errors.push("signup form: source attribution missing");

const opportunities = JSON.parse(read("growth/opportunities.json"));
const opportunityIds = opportunities.opportunities.map((item) => item.id);
for (const id of duplicate(opportunityIds)) errors.push("duplicate opportunity id: " + id);
for (const item of opportunities.opportunities) {
  if (!item.targetKeyword || !item.status) errors.push("opportunity missing targetKeyword/status: " + item.id);
  if (item.status === "implemented" && !keywords.includes(item.targetKeyword.toLowerCase())) {
    errors.push("implemented opportunity has no matching guide keyword: " + item.targetKeyword);
  }
}

const operator = JSON.parse(read("growth/operator-contract.json"));
if (operator?.orchestrator !== "Perception") errors.push("operator-contract: orchestrator must be Perception");
if (!operator?.job?.prohibitedWithoutApproval?.includes("publish")) errors.push("operator-contract: publish must require approval");

const workers = JSON.parse(read("growth/worker-registry.json"));
if (!workers.workers.some((worker) => worker.id === "lmtyai-renderer" && worker.status === "active")) {
  errors.push("worker-registry: active native renderer missing");
}
for (const worker of workers.workers.filter((worker) => worker.implementation !== "native")) {
  if (!worker.repository || !worker.status) errors.push("worker-registry: incomplete external worker " + worker.id);
}

const baseline = JSON.parse(read("growth/baseline.json"));
if (baseline.status !== "awaiting_connected_measurement") errors.push("baseline: unexpected status");
for (const [key, value] of Object.entries(baseline.metrics)) {
  if (value !== null) errors.push("baseline metric must remain null until authoritative measurement: " + key);
}

if (errors.length) {
  console.error("Growth audit failed:");
  for (const error of errors) console.error("- " + error);
  process.exit(1);
}
console.log("Growth audit passed: " + slugs.length + " guides, canonical host clean, conversion attribution present.");
