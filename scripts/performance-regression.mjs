import fs from "node:fs";

const growthWidgets = fs.readFileSync(
  new URL("../components/growth-widgets.tsx", import.meta.url),
  "utf8",
);

const highFrequencyDocumentMouseout = [
  'document.addEventListener("mouseout"',
  "document.addEventListener('mouseout'",
].some((pattern) => growthWidgets.includes(pattern));

if (highFrequencyDocumentMouseout) {
  console.error(
    "Performance regression: ExitPopup must not attach a document-wide mouseout listener. Use a viewport-exit listener instead.",
  );
  process.exit(1);
}

console.log("Performance regression check passed.");
