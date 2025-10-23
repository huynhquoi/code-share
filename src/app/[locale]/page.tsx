"use client";

import { Button } from "@/components/ui/button";
import { Code2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function HomePage() {
  const user = undefined; // Replace with actual user authentication logic
  const t = useTranslations("home");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
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
            {user ? (
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
        </div>
      </div>
    </div>
  );
}
