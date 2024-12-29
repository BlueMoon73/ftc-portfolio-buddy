import { z } from "zod";

export const feedbackSchema = z.object({
  award: z.string(),
  feedback: z.string(),
    severity: z.enum(["high", "medium", "low"]).optional()
});

export type Feedback = z.infer<typeof feedbackSchema>;

export const feedbackArraySchema = z.array(feedbackSchema);