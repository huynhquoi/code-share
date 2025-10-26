// src/lib/auth-helpers.ts
import { auth } from "./auth";
import { redirect } from "next/navigation";

/**
 * Get current session (Server Component)
 * @returns Session or null
 */
export async function getCurrentSession() {
  return await auth();
}

/**
 * Get current user (Server Component)
 * @returns User or null
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Require authentication (Server Component)
 * Redirects to login if not authenticated
 */
export async function requireAuth(redirectTo: string = "/login") {
  const session = await auth();

  if (!session?.user) {
    redirect(redirectTo);
  }

  return session;
}

/**
 * Require specific role (Server Component)
 * Redirects if user doesn't have required role
 */
export async function requireRole(
  role: string | string[],
  redirectTo: string = "/"
) {
  const session = await requireAuth();
  const roles = Array.isArray(role) ? role : [role];

  // session.user is guaranteed to exist after requireAuth()
  if (!session?.user || !roles.includes(session.user.role)) {
    redirect(redirectTo);
  }

  return session;
}

/**
 * Check if user has role
 */
export async function hasRole(role: string | string[]): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.role) return false;

  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(session.user.role);
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return await hasRole("ADMIN");
}

/**
 * Require admin role
 */
export async function requireAdmin(redirectTo: string = "/") {
  return await requireRole("ADMIN", redirectTo);
}
