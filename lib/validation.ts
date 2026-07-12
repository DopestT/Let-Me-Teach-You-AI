import { z } from "zod";

/** Newsletter signup — the only personal data we collect is email + optional name. */
export const subscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .min(3, "Please enter your email address.")
    .max(254)
    .email("That doesn't look like a valid email address."),
  firstName: z.string().trim().max(80).optional().default(""),
  // Honeypot: bots fill this; humans never see it.
  company: z.string().max(0).optional(),
});
export type SubscribeInput = z.infer<typeof subscribeSchema>;

/** Contact form. */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email.").max(254),
  message: z
    .string()
    .trim()
    .min(10, "Please write a bit more so we can help.")
    .max(4000),
  company: z.string().max(0).optional(), // honeypot
});
export type ContactInput = z.infer<typeof contactSchema>;

/** Generic server-side AI generation request (scaffolding for future tools). */
export const aiGenerateSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required.")
    .max(4000, "Prompt is too long."),
  // Optional task hint so the server can pick a system prompt / preset.
  task: z
    .enum(["prompt-help", "summarize", "lesson", "general"])
    .optional()
    .default("general"),
});
export type AiGenerateInput = z.infer<typeof aiGenerateSchema>;
