import slugify from "slugify";
import { prisma } from "@/lib/prisma";

export async function generateUniqueSlug(
  title: string,
  existingId?: string
): Promise<string> {
  const slug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  let counter = 0;
  let uniqueSlug = slug;

  while (true) {
    const existing = await prisma.snippet.findUnique({
      where: { slug: uniqueSlug },
      select: { id: true },
    });

    if (!existing || existing.id === existingId) {
      break;
    }

    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }

  return uniqueSlug;
}

export function formatCode(code: string): string {
  return code.trim();
}

export function getLanguageDisplayName(lang: string): string {
  const languageMap: Record<string, string> = {
    js: "JavaScript",
    ts: "TypeScript",
    jsx: "React JSX",
    tsx: "React TSX",
    py: "Python",
    rb: "Ruby",
    go: "Go",
    rs: "Rust",
    java: "Java",
    cpp: "C++",
    c: "C",
    cs: "C#",
    php: "PHP",
    swift: "Swift",
    kt: "Kotlin",
    sql: "SQL",
    html: "HTML",
    css: "CSS",
    scss: "SCSS",
    json: "JSON",
    yaml: "YAML",
    md: "Markdown",
    sh: "Shell",
    bash: "Bash",
  };

  return languageMap[lang.toLowerCase()] || lang.toUpperCase();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function calculateReadingTime(code: string): number {
  const wordsPerMinute = 200;
  const words = code.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}
