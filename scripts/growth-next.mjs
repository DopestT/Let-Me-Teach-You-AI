import fs from "node:fs";

const queue = JSON.parse(fs.readFileSync("growth/opportunities.json", "utf8"));
const candidates = queue.opportunities
  .filter((item) => item.status === "backlog")
  .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

if (!candidates.length) {
  console.log(JSON.stringify({ status: "empty", message: "No backlog opportunity is eligible for autonomous selection." }, null, 2));
  process.exit(0);
}

const selected = candidates[0];
console.log(JSON.stringify({
  status: "selected",
  selectionRule: "highest_score_backlog_only",
  opportunity: selected,
  guardrail: "Selection does not authorize publishing. Create/refresh work still requires verification and the configured review gate."
}, null, 2));
