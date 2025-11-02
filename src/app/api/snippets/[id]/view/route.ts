import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  id: string;
}

/**
 * POST /api/snippets/[id]/view
 * Increment view count for a snippet
 */
export async function POST(
  request: NextRequest,
  context: { params: Params } | { params: Promise<Params> }
) {
  try {
    const params = (await context.params) as Params;
    const snippetId = params.id;

    // Check if snippet exists
    const snippet = await prisma.snippet.findUnique({
      where: { id: snippetId },
      select: { id: true },
    });

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    // Increment view count
    const updatedSnippet = await prisma.snippet.update({
      where: { id: snippetId },
      data: {
        viewCount: { increment: 1 },
      },
      select: {
        id: true,
        viewCount: true,
      },
    });

    return NextResponse.json({
      success: true,
      views: updatedSnippet.viewCount,
    });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return NextResponse.json(
      { error: "Failed to increment view count" },
      { status: 500 }
    );
  }
}
