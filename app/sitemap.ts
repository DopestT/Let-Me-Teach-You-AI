import type { MetadataRoute } from "next";
import { aiBusinessCourse } from "@/lib/courses";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://letmeteachyouai.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const courseBase = `${SITE_URL}/learn/${aiBusinessCourse.slug}`;

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: courseBase, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...aiBusinessCourse.lessons.map((lesson) => ({
      url: `${courseBase}/${lesson.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    { url: `${SITE_URL}/build/ai-workflow-from-plain-english`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/playground`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/disclosure`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
