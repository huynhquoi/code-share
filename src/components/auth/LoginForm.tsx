"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().min(1, t("requiredEmail")).email(t("invalidEmail")),
    password: z.string().min(1, "requiredPassword"),
  });

type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

interface LoginFormProps {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl = "/" }: LoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const v = useTranslations("auth.validations");
  const f = useTranslations("auth.form");
  const n = useTranslations("auth.notifications");

  const loginSchema = createLoginSchema(v);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success(n("loginSuccess"));
      router.push(callbackUrl);
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(n("invalidCredentials") + ": " + error.message);
      } else {
        toast.error(n("invalidCredentials"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{f("email")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={f("emailPlaceholder")}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{f("password")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={f("passwordPlaceholder")}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? f("loadingLogin") : f("submitLogin")}
        </Button>

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            {f("forgotPassword")}
          </Link>
        </div>
      </form>
    </Form>
  );
}
