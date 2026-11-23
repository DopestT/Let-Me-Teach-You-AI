# LMTYAI Course Pack - November 20, 2026

This is a review-only implementation on branch `course-pack-2026-11-20`. It does **not** activate paid access, send email, publish a site, enable production course enrollment, or include filmed videos.

## Scope completed in branch

- Preserved the existing five-part `Build an AI Business From Scratch` content and layout. Added a companion workbook PDF and editable Markdown source.
- Added three distinct five-lesson courses: `AI Basics for Everyday Work`, `Prompting for Productivity`, and `AI Workflow Lab`.
- Added 15 written lesson pages with explicit outcomes, two teaching sections, a weak-vs-better worked example, verifiable practice assignments, a multiple-choice knowledge check with answer and explanation, and an instructor video script in the workbook source.
- Added three new course overview routes and one shared generic lesson route using static params.
- Added four printable workbooks (5, 8, 7, and 7 pages respectively; 27 total) and their editable Markdown sources.
- Kept the site's existing color palette, type classes, header, footer, and primary homepage funnel. No existing routes were removed or redirected.
- Added the course overviews and lessons to the generated sitemap.
- Added `scripts/generate-course-workbooks.mjs` to generate PDFs from the editable sources during `npm run build`. Build output files are reproducible.

## Local verification evidence

- Main starting commit: `2a9c8df17c21d87336d69edf205d76f4a4d7f339`.
- `npm ci --ignore-scripts --no-audit --no-fund`: exit 0.
- `npm run build`: exit 0 after adding all course pages and workbook generation; Next.js 16.2.6 compiled and TypeScript passed.
- Existing newsletter, performance, and growth source audits: PASS. These are code checks, not proof of live Brevo delivery.
- Generated Next.js routes: existing five flagship lessons plus three course overviews and 15 additional lessons.
- Local HTTP checks: status 200 for `/learn`, original course page, three new course pages, sampled lesson pages, and four Markdown workbooks.
- Four PDF workbooks generated successfully and inspected via a Quick Look first-page thumbnail for AI Basics: layout readable; no visible clipping on the inspected first page.
- Existing `/api/subscriber-count` build-time dynamic-server warning was logged but did not fail the build and is unrelated to the new course content.

## Not established by these checks

- No filmed videos, narration, captions, downloadable MP4s or demonstrably accessible video player.
- No real student completion sessions, verified phone/desktop browser screenshots, or accessibility assistive-technology sessions.
- No customer entitlement, paid course checkout/receipt, bundle fulfillment, completion certificates, progress persistence, or actual revenue verified.
- No production deployment, merge, publication, user enrollment, or live purchase test authorized or performed.

## Next acceptance gates

1. Preview URL and independent browser/mobile QA across the 20 lesson pages, downloads, keyboard navigation, headings, links, and full student path.
2. Film or produce and independently verify each instructional video; add captions, transcript, and rights-cleared assets before any claim of a video course.
3. Verify the intended product packaging and payment/entitlement design for the proposed paid bundle; no pricing or live payment changes during this workstream.
4. Obtain explicit owner approval before merge/deployment/publishing/selling. Only mark DONE after student end-to-end completion is demonstrated.

## Issue alignment

- [#28 Course 1 materials](https://github.com/DopestT/Let-Me-Teach-You-AI/issues/28)
- [#29 Prompting for Productivity](https://github.com/DopestT/Let-Me-Teach-You-AI/issues/29)
- [#30 AI Workflow Lab and catalog](https://github.com/DopestT/Let-Me-Teach-You-AI/issues/30)

The target of full completion by end of Nov 20 is an execution goal, **not** proof the remaining media and release gates have been met.
