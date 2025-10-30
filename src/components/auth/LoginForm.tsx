"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { LoadingButton } from "@/components/custom-ui/loading-button";
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
import { useAsync } from "@/hooks/use-async";

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
  
  const v = useTranslations("auth.validations");
  const f = useTranslations("auth.form");
  const n = useTranslations("auth.notifications");

  const { execute, isLoading } = useAsync({
    successMessage: n("loginSuccess"),
    errorMessage: n("invalidCredentials"),
    showSuccessToast: true,
    showErrorToast: true,
  });

  const loginSchema = createLoginSchema(v);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await execute(async () => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push(callbackUrl);
      router.refresh();
    });
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

        <LoadingButton 
          type="submit" 
          className="w-full" 
          isLoading={isLoading}
          loadingText={f("loadingLogin")}
        >
          {f("submitLogin")}
        </LoadingButton>

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