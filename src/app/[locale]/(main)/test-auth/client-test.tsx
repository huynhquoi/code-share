// src/app/(main)/test-auth/client-test.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function ClientTest() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Not authenticated</p>;

  return (
    <div className="mt-8 p-4 border rounded">
      <h2 className="font-semibold mb-2">Client Session:</h2>
      <p>Username: {session.user.username}</p>
      <p>Role: {session.user.role}</p>

      <Button onClick={() => signOut()} className="mt-4">
        Sign Out
      </Button>
    </div>
  );
}
