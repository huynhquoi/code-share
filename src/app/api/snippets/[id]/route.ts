import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serverUpdateSnippetSchema } from "@/lib/validations/snippet.server";
import { generateUniqueSlug } from "@/lib/snippets";

interface Params {
  id: string;
}

/**
 * GET /api/snippets/[id]
 * Get a single snippet by ID
 */
export async function GET(
  request: NextRequest,
  context: { params: Params } | { params: Promise<Params> }
) {
  const params = (await context.params) as Params;
  const snippetId = params.id;

  try {
    const session = await auth();

    const snippet = await prisma.snippet.findUnique({
      where: { id: snippetId },
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
    });

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    // Check if user can access private snippet
    if (!snippet.isPublic && snippet.authorId !== session?.user?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(snippet);
  } catch (error) {
    console.error("Error fetching snippet:", error);
    return NextResponse.json(
      { error: "Failed to fetch snippet" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/snippets/[id]
 * Update a snippet
 */
export async function PUT(
  request: NextRequest,
  context: { params: Params } | { params: Promise<Params> }
) {
  const params = (await context.params) as Params;
  const snippetId = params.id;

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if snippet exists and user owns it
    const existingSnippet = await prisma.snippet.findUnique({
      where: { id: snippetId },
      select: { id: true, authorId: true, slug: true },
    });

    if (!existingSnippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    if (existingSnippet.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = serverUpdateSnippetSchema.parse(body);

    // If title changed, regenerate slug
    let newSlug = existingSnippet.slug;
    if (validatedData.title) {
      newSlug = await generateUniqueSlug(validatedData.title, snippetId);
    }

    // Update snippet
    const updatedSnippet = await prisma.snippet.update({
      where: { id: snippetId },
      data: {
        ...validatedData,
        slug: newSlug,
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

    return NextResponse.json(updatedSnippet);
  } catch (error) {
    console.error("Error updating snippet:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update snippet" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/snippets/[id]
 * Delete a snippet
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Params } | { params: Promise<Params> }
) {
  const params = (await context.params) as Params;
  const snippetId = params.id;

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if snippet exists and user owns it
    const existingSnippet = await prisma.snippet.findUnique({
      where: { id: snippetId },
      select: { id: true, authorId: true },
    });

    if (!existingSnippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    if (existingSnippet.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete snippet (cascade will delete comments)
    await prisma.snippet.delete({
      where: { id: snippetId },
    });

    return NextResponse.json(
      { message: "Snippet deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting snippet:", error);
    return NextResponse.json(
      { error: "Failed to delete snippet" },
      { status: 500 }
    );
  }
}
