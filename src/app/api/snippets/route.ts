import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/lib/auth';
import { prisma } from "@/lib/prisma";
import { 
  serverSnippetSchema,
  snippetQuerySchema 
} from '@/lib/validations/snippet.server';
import { Prisma } from "@prisma/client";
import { generateUniqueSlug } from "@/lib/snippets";

/**
 * GET /api/snippets
 * List snippets with filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const query = snippetQuerySchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
      language: searchParams.get("language") || undefined,
      tag: searchParams.get("tag") || undefined,
      search: searchParams.get("search") || undefined,
      authorId: searchParams.get("authorId") || undefined,
      isPublic: searchParams.get("isPublic") || undefined,
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
    });

    const session = await auth();
    const skip = (query.page - 1) * query.limit;

    // Build where clause
    const where: Prisma.SnippetWhereInput = {
      AND: [
        // Public filter
        query.isPublic !== undefined
          ? { isPublic: query.isPublic }
          : session?.user?.id
            ? { OR: [{ isPublic: true }, { authorId: session.user.id }] }
            : { isPublic: true },

        // Language filter
        query.language ? { language: query.language } : {},

        // Tag filter
        query.tag
          ? {
              tags: {
                some: {
                  slug: query.tag,
                },
              },
            }
          : {},

        // Author filter
        query.authorId ? { authorId: query.authorId } : {},

        // Search filter
        query.search
          ? {
              OR: [
                { title: { contains: query.search, mode: "insensitive" } },
                {
                  description: { contains: query.search, mode: "insensitive" },
                },
                { code: { contains: query.search, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    };

    // Execute queries
    const [snippets, totalCount] = await Promise.all([
      prisma.snippet.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              email: true,
              image: true,
            },
          },
          tags: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
      prisma.snippet.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / query.limit);

    return NextResponse.json({
      snippets,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalCount,
        totalPages,
        hasMore: query.page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching snippets:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/snippets
 * Create a new snippet
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = serverSnippetSchema.parse(body);

    // Generate unique slug
    const slug = await generateUniqueSlug(validatedData.title);

    // Create snippet
    const snippet = await prisma.snippet.create({
      data: {
        ...validatedData,
        slug,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(snippet, { status: 201 });
  } catch (error) {
    console.error("Error creating snippet:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create snippet" },
      { status: 500 }
    );
  }
}
