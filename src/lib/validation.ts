import { z } from "zod";

export const BookValidation = z.object({
  abbrev: z.object({
    pt: z.string(),
    en: z.string(),
  }),
  author: z.string(),
  chapters: z.number(),
  comment: z.string(),
  group: z.string(),
  name: z.string(),
  testament: z.string(),
  version: z.string()
});