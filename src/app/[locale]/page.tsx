import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { SnippetList } from "@/components/snippets/SnippetList";
import { Code2, Plus } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { SnippetListItem } from "@/types/snippet";
import { Prisma } from "@prisma/client";

interface HomePageProps {
  searchParams: {
    page?: string;
    limit?: string;
    language?: string;
    tag?: string;
    search?: string;
  };
}

async function getSnippets(searchParams: HomePageProps["searchParams"]) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.SnippetWhereInput = {
    isPublic: true,
  };

  if (searchParams.language) {
    where.language = searchParams.language;
  }

  if (searchParams.tag) {
    where.tags = {
      some: {
        slug: searchParams.tag,
      },
    };
  }

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
      { code: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  const [snippets, totalCount] = await Promise.all([
    prisma.snippet.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.snippet.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  const transformedSnippets: SnippetListItem[] = snippets.map((snippet) => ({
    id: snippet.id,
    slug: snippet.slug,
    title: snippet.title,
    description: snippet.description,
    code: snippet.code,
    language: snippet.language,
    viewCount: snippet.viewCount,
    commentCount: snippet.commentCount,
    isPublic: snippet.isPublic,
    createdAt: snippet.createdAt,
    author: {
      id: snippet.author.id,
      name: snippet.author.displayName || snippet.author.username,
      email: null,
      image: snippet.author.avatarUrl,
    },
    tags: snippet.tags,
  }));

  return {
    snippets: transformedSnippets,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const session = await auth();
  const t = await getTranslations("home");
  const resloveSearchParams = await searchParams
  const data = await getSnippets(resloveSearchParams);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-muted/40">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">{t("title")}</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-6">
              {t("subtitle")}
            </p>
            {session?.user ? (
              <Button asChild size="lg">
                <Link href="/snippets/new">
                  <Plus className="mr-2 h-5 w-5" />
                  {t("createSnippet")}
                </Link>
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button asChild size="lg">
                  <Link href="/register">{t("getStarted")}</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">{t("login")}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{t("recentSnippets")}</h2>
          <p className="text-muted-foreground">{t("exploreSnippets")}</p>
        </div>

        <Suspense fallback={<SnippetsListSkeleton />}>
          <SnippetList snippets={data.snippets} pagination={data.pagination} />
        </Suspense>
      </div>
    </div>
  );
}

function SnippetsListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  );
}