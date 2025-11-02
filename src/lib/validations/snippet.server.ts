import { z } from "zod";

export const serverSnippetSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
  code: z
    .string()
    .min(1, "Code is required")
    .max(50000, "Code must not exceed 50,000 characters"),
  language: z
    .string()
    .min(1, "Language is required")
    .max(50, "Language name is too long"),
  isPublic: z.boolean().default(true),
});

export const serverUpdateSnippetSchema = serverSnippetSchema.partial();

export const snippetQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  language: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  authorId: z.string().optional(),
  isPublic: z.coerce.boolean().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "viewCount", "title"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type SnippetQuery = z.infer<typeof snippetQuerySchema>;
