/**
 * Generates the 25-prompt lead-magnet PDF into public/lead-magnet/.
 * Run with:  npm run generate:pdf
 *
 * Uses pdf-lib (no system dependencies). Brand colors match the site:
 * warm white background, deep navy text, accessible blue + warm gold accents.
 */

import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Brand palette
const NAVY = rgb(0.059, 0.118, 0.239);
const SLATE = rgb(0.29, 0.345, 0.47);
const BLUE = rgb(0.114, 0.306, 0.847);
const GOLD = rgb(0.776, 0.592, 0.286);
const CREAM = rgb(0.984, 0.98, 0.969);

const PAGE_W = 612; // US Letter
const PAGE_H = 792;
const MARGIN = 56;
const MAX_W = PAGE_W - MARGIN * 2;

const data = JSON.parse(
  await readFile(join(root, "content/lead-magnet-prompts.json"), "utf8")
);

const pdf = await PDFDocument.create();
pdf.setTitle(data.title);
pdf.setAuthor(data.brand);
pdf.setSubject("A free starter pack of beginner AI prompts.");

const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
const fontSerif = await pdf.embedFont(StandardFonts.TimesRomanBold);

let page = pdf.addPage([PAGE_W, PAGE_H]);
let y = PAGE_H - MARGIN;

function fillBackground(p) {
  p.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: CREAM });
}
fillBackground(page);

function newPage() {
  page = pdf.addPage([PAGE_W, PAGE_H]);
  fillBackground(page);
  y = PAGE_H - MARGIN;
}

function ensureSpace(needed) {
  if (y - needed < MARGIN) newPage();
}

// Word-wrap helper
function wrap(text, font, size, maxWidth) {
  const words = text.split(/\s+/);
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

function drawParagraph(text, { font, size, color, indent = 0, gap = 4, lineGap = 3 }) {
  const lines = wrap(text, font, size, MAX_W - indent);
  for (const line of lines) {
    ensureSpace(size + lineGap);
    page.drawText(line, {
      x: MARGIN + indent,
      y: y - size,
      size,
      font,
      color,
    });
    y -= size + lineGap;
  }
  y -= gap;
}

// --- Cover header ---
page.drawText(data.brand.toUpperCase(), {
  x: MARGIN,
  y: y - 10,
  size: 10,
  font: fontBold,
  color: GOLD,
});
y -= 34;

drawParagraph(data.title, { font: fontSerif, size: 26, color: NAVY, gap: 8 });
drawParagraph(data.subtitle, { font: fontRegular, size: 12, color: SLATE, gap: 10 });

// Accent rule
ensureSpace(20);
page.drawRectangle({ x: MARGIN, y: y - 2, width: 64, height: 3, color: BLUE });
y -= 22;

let counter = 0;
for (const section of data.sections) {
  ensureSpace(40);
  drawParagraph(section.name, {
    font: fontBold,
    size: 14,
    color: BLUE,
    gap: 6,
  });
  for (const prompt of section.prompts) {
    counter += 1;
    ensureSpace(24);
    // Number badge
    const label = String(counter).padStart(2, "0");
    page.drawText(label, {
      x: MARGIN,
      y: y - 12,
      size: 12,
      font: fontBold,
      color: GOLD,
    });
    drawParagraph(prompt, {
      font: fontRegular,
      size: 11.5,
      color: NAVY,
      indent: 28,
      gap: 8,
      lineGap: 3,
    });
  }
  y -= 6;
}

// Footer note
ensureSpace(60);
page.drawRectangle({ x: MARGIN, y: y - 2, width: MAX_W, height: 1, color: rgb(0.906, 0.886, 0.839) });
y -= 16;
drawParagraph(data.footer, { font: fontRegular, size: 10, color: SLATE, gap: 0 });

const bytes = await pdf.save();
const outDir = join(root, "public/lead-magnet");
await mkdir(outDir, { recursive: true });
const outPath = join(outDir, "Start_Using_AI_Today_25_Beginner_Prompts.pdf");
await writeFile(outPath, bytes);

console.log(`Generated ${outPath} (${counter} prompts, ${pdf.getPageCount()} pages)`);
