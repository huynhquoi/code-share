import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { locales } from "@/i18n/request";
import { ThemeProvider } from "next-themes";
import { NavBar } from "@/components/layout/NavBar";
import { ErrorBoundary } from "@/components/error/error-boundary";

// export const metadata: Metadata = {
//   title: "Code Snippet Platform",
//   description: "Share and discover code snippets",
// };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: t("title") + " - Share and Discover Code",
    description: t("subtitle"),
    keywords: ["code snippets", "programming", "algorithms", "coding"],
  };
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

type Locale = (typeof locales)[number];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          <NextIntlClientProvider messages={messages}>
            <ErrorBoundary>
              <NavBar />
              <main>{children}</main>
              <Toaster richColors position="top-right" />
            </ErrorBoundary>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
