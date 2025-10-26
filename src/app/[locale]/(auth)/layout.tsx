import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function AuthLayout({
  children,
  params,
}: AuthLayoutProps) {
  const session = await auth();
  const resloveParams = await params;
  const { locale } = resloveParams;

  if (session) {
    redirect(`/${locale}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-8">{children}</div>
    </div>
  );
}
