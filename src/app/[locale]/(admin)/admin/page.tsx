import { requireAdmin } from "@/lib/auth-helpers";

export default async function AdminPage() {
  const session = await requireAdmin(); // Auto redirect if not admin

  return (
    <div className="p-8">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.user.username}!</p>
    </div>
  );
}
