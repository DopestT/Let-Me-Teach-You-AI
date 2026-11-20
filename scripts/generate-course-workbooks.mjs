import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const here = path.dirname(fileURLToPath(import.meta.url));
const resourceDir = path.resolve(here, "../public/course-resources");
const files = (await readdir(resourceDir)).filter((name) => name.endsWith("-workbook.md")).sort();
if (files.length !== 4) {
  throw new Error(`Expected exactly four course workbook sources, got ${files.length}`);
}

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const LEFT = 58;
const RIGHT = 554;
const TOP = 724;
const BOTTOM = 63;

function ascii(value) {
  return value.replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2192/g, "->")
    .replace(/\u2022/g, "*")
    .replace(/\u00a0/g, " ")
    .replace(/\u2264/g, "<=")
    .replace(/\u2265/g, ">=")
    .normalize("NFKD")
    .replace(/[^\x20-\x7e]/g, "");
}

function unformat(markdown) {
  return ascii(markdown.replace(/\*\*/g, "").replace(/`/g, "").replace(/\\\$/g, "$"));
}

async function buildWorkbook(filename) {
  const body = await readFile(path.join(resourceDir, filename), "utf8");
  const document = await PDFDocument.create();
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  let page;
  let y;
  let pageCount = 0;
  const navy = rgb(0.06, 0.13, 0.25);
  const blue = rgb(0.14, 0.33, 0.94);
  const gray = rgb(0.29, 0.38, 0.50);

  function newPage() {
    page = document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pageCount += 1;
    page.drawText("LET ME TEACH YOU AI  /  STUDENT WORKBOOK", {
      x: LEFT, y: 754, font: bold, size: 8.5, color: blue,
    });
    page.drawLine({ start: { x: LEFT, y: 744 }, end: { x: RIGHT, y: 744 }, thickness: 0.6, color: rgb(.8,.84,.91) });
    page.drawLine({ start: { x: LEFT, y: 49 }, end: { x: RIGHT, y: 49 }, thickness: 0.4, color: rgb(.82,.85,.91) });
    page.drawText(`Page ${pageCount}`, { x: RIGHT-38, y: 32, font: regular, size: 8, color: gray });
    y = TOP;
  }

  function ensureSpace(needed) {
    if (!page || y - needed < BOTTOM) newPage();
  }

  function drawWrapped(text, opts = {}) {
    const size = opts.size ?? 10.5;
    const font = opts.bold ? bold : regular;
    const lineHeight = opts.lineHeight ?? size * 1.47;
    const color = opts.color ?? navy;
    const indent = opts.indent ?? 0;
    const maxWidth = RIGHT - LEFT - indent;
    const words = unformat(text).split(/\s+/).filter(Boolean);
    if (!words.length) { y -= 7; return; }
    const lines = [];
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate;
      } else {
        if (line) lines.push(line);
        if (font.widthOfTextAtSize(word, size) > maxWidth) {
          // Split unusually long unbroken strings so text never clips.
          let piece = "";
          for (const ch of word) {
            if (font.widthOfTextAtSize(piece + ch, size) > maxWidth && piece) { lines.push(piece); piece = ch; }
            else piece += ch;
          }
          line = piece;
        } else line = word;
      }
    }
    if (line) lines.push(line);
    for (const row of lines) {
      ensureSpace(lineHeight + 2);
      page.drawText(row, { x: LEFT + indent, y, font, size, color });
      y -= lineHeight;
    }
    y -= opts.after ?? 5;
  }

  newPage();
  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) { y -= 6; continue; }
    if (line === "---") { y -= 8; ensureSpace(16); page.drawLine({ start: { x: LEFT, y }, end: { x: RIGHT, y }, thickness: .65, color: rgb(.79,.84,.91) }); y -= 16; continue; }
    if (line.startsWith("# ")) { y -= 8; drawWrapped(line.slice(2), { size: 20, bold: true, color: blue, lineHeight: 25, after: 11 }); continue; }
    if (line.startsWith("## ")) { ensureSpace(47); y -= 6; drawWrapped(line.slice(3), { size: 14.5, bold: true, lineHeight: 19, after: 10 }); continue; }
    if (line.startsWith("### ")) { ensureSpace(35); y -= 4; drawWrapped(line.slice(4), { size: 11.5, bold: true, lineHeight: 17, after: 8 }); continue; }
    if (/^[-*] /.test(line)) { drawWrapped("- " + line.slice(2), { indent: 14, after: 3 }); continue; }
    if (/^\d+\. /.test(line)) { drawWrapped(line, { indent: 10, after: 3 }); continue; }
    drawWrapped(line);
  }
  const out = path.join(resourceDir, filename.replace(/\.md$/, ".pdf"));
  await writeFile(out, await document.save());
  return { file: path.basename(out), pages: pageCount };
}

for (const filename of files) {
  const result = await buildWorkbook(filename);
  process.stdout.write(`Generated ${result.file} (${result.pages} pages)\n`);
}
