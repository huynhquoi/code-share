// src/app/(main)/test-auth/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TestAuthPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Session Data:</h2>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>

      <div className="mt-4">
        <p>✅ ID: {session.user.id}</p>
        <p>✅ Email: {session.user.email}</p>
        <p>✅ Username: {session.user.username}</p>
        <p>✅ Role: {session.user.role}</p>
      </div>
    </div>
  );
}
