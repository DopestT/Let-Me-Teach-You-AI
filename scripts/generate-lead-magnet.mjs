/**
 * Generates the AI Work Kit PDF into public/lead-magnet/.
 * Run with: npm run generate:pdf
 */

import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const NAVY = rgb(0.059, 0.118, 0.239);
const SLATE = rgb(0.29, 0.345, 0.47);
const BLUE = rgb(0.114, 0.306, 0.847);
const GOLD = rgb(0.776, 0.592, 0.286);
const CREAM = rgb(0.984, 0.98, 0.969);
const LINE = rgb(0.906, 0.886, 0.839);

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 56;
const MAX_W = PAGE_W - MARGIN * 2;

const data = JSON.parse(
  await readFile(join(root, "content/lead-magnet-prompts.json"), "utf8")
);

const pdf = await PDFDocument.create();
pdf.setTitle(data.title);
pdf.setAuthor(data.brand);
pdf.setSubject("A practical AI work kit with prompts, workflows, and a quick-start guide.");

const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
const fontSerif = await pdf.embedFont(StandardFonts.TimesRomanBold);

let page;
let y;

function fillBackground(p) {
  p.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: CREAM });
}

function newPage() {
  page = pdf.addPage([PAGE_W, PAGE_H]);
  fillBackground(page);
  y = PAGE_H - MARGIN;
}

function ensureSpace(needed) {
  if (y - needed < MARGIN) newPage();
}

function wrap(text, font, size, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function paragraph(text, { font = fontRegular, size = 11.5, color = NAVY, indent = 0, gap = 5, lineGap = 3 } = {}) {
  const lines = wrap(text, font, size, MAX_W - indent);
  for (const line of lines) {
    ensureSpace(size + lineGap + 2);
    page.drawText(line, { x: MARGIN + indent, y: y - size, size, font, color });
    y -= size + lineGap;
  }
  y -= gap;
}

function rule(width = 64, color = BLUE) {
  ensureSpace(18);
  page.drawRectangle({ x: MARGIN, y: y - 2, width, height: 3, color });
  y -= 18;
}

function sectionTitle(title, kicker) {
  ensureSpace(54);
  if (kicker) {
    paragraph(kicker.toUpperCase(), { font: fontBold, size: 9.5, color: GOLD, gap: 5 });
  }
  paragraph(title, { font: fontSerif, size: 20, color: NAVY, gap: 8 });
  rule(48);
}

function numberedItem(number, text) {
  ensureSpace(34);
  const label = String(number).padStart(2, "0");
  page.drawText(label, { x: MARGIN, y: y - 12, size: 11, font: fontBold, color: GOLD });
  paragraph(text, { indent: 28, size: 11.2, gap: 8 });
}

newPage();

// Cover
paragraph(data.brand.toUpperCase(), { font: fontBold, size: 10, color: GOLD, gap: 16 });
paragraph(data.title, { font: fontSerif, size: 30, color: NAVY, gap: 8 });
paragraph(data.subtitle, { size: 13, color: SLATE, gap: 10 });
rule(76);
paragraph("STOP COLLECTING AI PROMPTS. START USING AI LIKE A COWORKER.", {
  font: fontBold,
  size: 11,
  color: BLUE,
  gap: 14,
});
paragraph("Inside: 25 practical prompts, 5 complete workflows, a tool cheat sheet, and a 10-minute quick start.", {
  size: 12,
  color: NAVY,
  gap: 22,
});
paragraph("Use this kit with the AI tool you already have. The goal is not to memorize prompts — it is to get useful work moving.", {
  size: 11.5,
  color: SLATE,
  gap: 0,
});

// Quick start
newPage();
sectionTitle("10-Minute Quick Start", "Start here");
data.quickStart.forEach((item, i) => numberedItem(i + 1, item));

// Tool cheat sheet
sectionTitle("Which AI Tool for What?", "One-page cheat sheet");
for (const row of data.toolCheatSheet) {
  ensureSpace(48);
  paragraph(row.task, { font: fontBold, size: 11.2, color: NAVY, gap: 3 });
  paragraph(row.tool, { size: 10.8, color: SLATE, indent: 12, gap: 10 });
}

// Prompts
let counter = 0;
for (const section of data.sections) {
  newPage();
  sectionTitle(section.name, "25 ready-to-use prompts");
  for (const prompt of section.prompts) {
    counter += 1;
    numberedItem(counter, prompt);
  }
}

// Workflows
newPage();
sectionTitle("5 Plug-and-Play Workflows", "Move from prompt to process");
let workflowNumber = 0;
for (const workflow of data.workflows) {
  workflowNumber += 1;
  ensureSpace(86);
  paragraph(`${workflowNumber}. ${workflow.name}`, { font: fontSerif, size: 16, color: BLUE, gap: 6 });
  workflow.steps.forEach((step, i) => {
    paragraph(`${i + 1}. ${step}`, { size: 10.8, color: NAVY, indent: 14, gap: 5 });
  });
  y -= 8;
}

// Footer note
ensureSpace(70);
page.drawRectangle({ x: MARGIN, y: y - 2, width: MAX_W, height: 1, color: LINE });
y -= 16;
paragraph(data.footer, { size: 10, color: SLATE, gap: 0 });

const bytes = await pdf.save();
const outDir = join(root, "public/lead-magnet");
await mkdir(outDir, { recursive: true });
const outPath = join(outDir, "AI_Work_Kit.pdf");
await writeFile(outPath, bytes);

console.log(`Generated ${outPath} (${counter} prompts, ${workflowNumber} workflows, ${pdf.getPageCount()} pages)`);
