import { redirect } from "next/navigation";
import { SnippetForm } from "@/components/snippets/SnippetForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Create New Snippet",
  description: "Share your code with the community",
};

export default async function NewSnippetPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/snippets/new");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Snippet</CardTitle>
          <CardDescription>Share your code with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <SnippetForm />
        </CardContent>
      </Card>
    </div>
  );
}
