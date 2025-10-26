"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { Link } from "@/i18n/routing";

export default function LoginClient() {
  const t = useTranslations("auth.login");

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <OAuthButtons />
        <LoginForm />
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center w-full text-muted-foreground">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-primary hover:underline">
            {t("signUp")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
