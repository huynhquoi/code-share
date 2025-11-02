import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { prisma } from "@/lib/prisma";
import { CodeBlock } from "@/components/snippets/CodeBlock";
import { DeleteConfirmDialog } from "@/components/snippets/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Edit, Eye, Calendar, Lock } from "lucide-react";
import { auth } from "@/lib/auth";
import { getLanguageDisplayName } from "@/lib/snippets";
import { ViewCountTracker } from "@/components/snippets/ViewCountTracker";

async function getSnippet(slug: string) {
  const snippet = await prisma.snippet.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          email: true,
          image: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return snippet;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const resloveParams = await params;
  const snippet = await getSnippet(resloveParams.slug);

  if (!snippet) {
    return {
      title: "Snippet Not Found",
    };
  }

  return {
    title: snippet.title,
    description: snippet.description || `${snippet.language} code snippet`,
  };
}

export default async function SnippetDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();

  const resloveParams = await params
  const snippet = await getSnippet(resloveParams.slug);

  if (!snippet) {
    notFound();
  }

  if (!snippet.isPublic && snippet.authorId !== session?.user?.id) {
    notFound();
  }

  const isOwner = session?.user?.id === snippet.authorId;
  const languageDisplay = getLanguageDisplayName(snippet.language);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <ViewCountTracker snippetId={snippet.id} />

      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{snippet.title}</h1>
              {!snippet.isPublic && (
                <Badge variant="secondary">
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </Badge>
              )}
            </div>
            {snippet.description && (
              <p className="text-muted-foreground text-lg">
                {snippet.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {isOwner && (
            <div className="flex gap-2">
              <Link href={`/snippets/${snippet.slug}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <DeleteConfirmDialog
                snippetId={snippet.id}
                snippetTitle={snippet.title}
              />
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
          {/* Author */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={snippet.author.image || undefined} />
              <AvatarFallback>
                {snippet.author.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span>{snippet.author.username || "Anonymous"}</span>
          </div>

          <Separator orientation="vertical" className="h-4" />

          {/* Language */}
          <Badge variant="outline">{languageDisplay}</Badge>

          <Separator orientation="vertical" className="h-4" />

          {/* Views */}
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{snippet.viewCount} views</span>
          </div>

          <Separator orientation="vertical" className="h-4" />

          {/* Created Date */}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDistanceToNow(new Date(snippet.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Code Block */}
      <div className="mb-8">
        <CodeBlock code={snippet.code} language={snippet.language} />
      </div>

      {/* Comments Section Placeholder */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">
          Comments ({snippet.commentCount})
        </h2>
        <p className="text-muted-foreground">
          Comments feature will be implemented in Phase 3
        </p>
      </div>
    </div>
  );
}
