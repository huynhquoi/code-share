import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SnippetForm } from "@/components/snippets/SnippetForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";

async function getSnippet(slug: string) {
  const snippet = await prisma.snippet.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      code: true,
      language: true,
      tags: true,
      isPublic: true,
      authorId: true,
    },
  });

  return snippet;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const resloveParams = params;
  const snippet = await getSnippet(resloveParams.slug);

  if (!snippet) {
    return {
      title: "Snippet Not Found",
    };
  }

  return {
    title: `Edit: ${snippet.title}`,
  };
}

export default async function EditSnippetPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/snippets/" + params.slug + "/edit");
  }

  const snippet = await getSnippet(params.slug);

  if (!snippet) {
    notFound();
  }

  // Check if user owns the snippet
  if (snippet.authorId !== session.user?.id) {
    redirect("/snippets/" + params.slug);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Snippet</CardTitle>
          <CardDescription>Update your code snippet</CardDescription>
        </CardHeader>
        <CardContent>
          <SnippetForm
            initialData={{
              id: snippet.id,
              slug: snippet.slug,
              title: snippet.title,
              description: snippet.description ?? undefined,
              code: snippet.code,
              language: snippet.language,
              isPublic: snippet.isPublic,
            }}
            isEditing
          />
        </CardContent>
      </Card>
    </div>
  );
}
