import { z } from "zod";

export const createSnippetSchema = (t: (key: string) => string) =>
  z.object({
    title: z
      .string()
      .min(3, t("titleMinLength"))
      .max(100, t("titleMaxLength")),
    description: z
      .string()
      .min(10, t("descriptionMinLength"))
      .max(500, t("descriptionMaxLength"))
      .optional()
      .or(z.literal("")),
    code: z
      .string()
      .min(1, t("codeRequired"))
      .max(50000, t("codeMaxLength")),
    language: z
      .string()
      .min(1, t("languageRequired"))
      .max(50, t("languageTooLong")),
    isPublic: z.boolean().catch(true),
  });

export const createUpdateSnippetSchema = (t: (key: string) => string) =>
  createSnippetSchema(t).partial();

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

export type CreateSnippetInput = z.infer<
  ReturnType<typeof createSnippetSchema>
>;
export type UpdateSnippetInput = z.infer<
  ReturnType<typeof createUpdateSnippetSchema>
>;
export type SnippetQuery = z.infer<typeof snippetQuerySchema>;
