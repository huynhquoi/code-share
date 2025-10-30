// src/middleware.ts
import { auth } from "@/lib/auth";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n/request";

// i18n middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default auth((req) => {
  // 1. Run i18n first
  const intlResponse = intlMiddleware(req as NextRequest);

  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Extract locale from pathname
  const pathnameWithoutLocale = pathname.replace(/^\/(en|vi)/, "") || "/";

  // Protected routes
  const protectedRoutes = ["/snippets/new", "/profile", "/settings"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  // Admin routes
  const isAdminRoute = pathnameWithoutLocale.startsWith("/admin");

  // Redirect to login if not authenticated
  if (!session && (isProtectedRoute || isAdminRoute)) {
    const locale = pathname.match(/^\/(en|vi)/)?.[1] || defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin role
  if (isAdminRoute && session?.user?.role !== "ADMIN") {
    const locale = pathname.match(/^\/(en|vi)/)?.[1] || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  return intlResponse;
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
  runtime: "nodejs",
};
