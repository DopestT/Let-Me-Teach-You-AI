import { aiBusinessCourse } from "@/lib/courses";
import { seoGuides } from "@/lib/seo-guides";

const SITE_URL = "https://letmeteachyouai.com";

export async function GET() {
  const lines = [
    "# Let Me Teach You AI",
    "",
    "> Practical AI education for beginners. Learn AI by building useful workflows, automations, agents, and small business systems.",
    "",
    "## Primary goal",
    "Help beginners turn AI concepts into useful, testable work. The free AI Work Kit is the main conversion offer.",
    "",
    "## Important pages",
    "- " + SITE_URL + "/",
    "- " + SITE_URL + "/ai-work-kit",
    "- " + SITE_URL + "/guides",
    "- " + SITE_URL + "/learn",
    "- " + SITE_URL + "/build/ai-workflow-from-plain-english",
    "",
    "## Guides",
    ...seoGuides.map((guide) => "- " + guide.title + ": " + SITE_URL + "/guides/" + guide.slug),
    "",
    "## Course",
    "- " + aiBusinessCourse.title + ": " + SITE_URL + "/learn/" + aiBusinessCourse.slug,
    ...aiBusinessCourse.lessons.map((lesson) => "  - " + lesson.title + ": " + SITE_URL + "/learn/" + aiBusinessCourse.slug + "/" + lesson.slug),
    "",
    "## Editorial principles",
    "- Practical outcomes over hype.",
    "- Explain assumptions and limits.",
    "- Keep consequential actions behind appropriate human review.",
    "- Prefer reliable workflows before adding agent autonomy.",
    ""
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}
