// src/lib/auth.ts
import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as Adapter,

  providers: [
    // Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // GitHub OAuth
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    // Email/Password
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.displayName || user.username,
          image: user.avatarUrl,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    // ✅ JWT Callback - Add user data to token
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }

      // Handle session update (e.g., profile update)
      if (trigger === "update" && session) {
        token.username = session.user.username;
        token.name = session.user.name;
        token.image = session.user.image;
      }

      // Sync with database on each request (optional, for real-time role changes)
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            username: true,
            role: true,
            displayName: true,
            avatarUrl: true,
          },
        });

        if (dbUser) {
          token.username = dbUser.username;
          token.role = dbUser.role;
          token.name = dbUser.displayName || dbUser.username;
          token.image = dbUser.avatarUrl;
        }
      }

      return token;
    },

    // ✅ Session Callback - Expose data to client
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    // ✅ Redirect Callback - Handle i18n
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    // ✅ SignIn Callback - Handle OAuth user creation
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Generate unique username
          const baseUsername = user.email!.split("@")[0];
          const randomSuffix = Math.random().toString(36).slice(2, 6);
          const username = `${baseUsername}${randomSuffix}`;

          // Create new OAuth user with default role
          await prisma.user.create({
            data: {
              email: user.email!,
              username,
              displayName: user.name || username,
              avatarUrl: user.image,
              emailVerified: new Date(),
              role: "USER", // ✅ Default role for OAuth users
            },
          });
        }
      }
      return true;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  // Enable debug in development
  debug: process.env.NODE_ENV === "development",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
