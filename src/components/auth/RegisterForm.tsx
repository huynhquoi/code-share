"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
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
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const createRegisterSchema = (t: (key: string) => string) => z
  .object({
    email: z
      .string()
      .min(1, t("requiredEmail"))
      .email(t("invalidEmail")),
    username: z
      .string()
      .min(3, t("usernameMinLength"))
      .max(20, t("usernameMaxLength"))
      .regex(
        /^[a-zA-Z0-9_]+$/,
        t("usernameContains")
      ),
    displayName: z
      .string()
      .max(50, t("displayNameMaxLength"))
      .optional(),
    password: z
      .string()
      .min(6, t("passwordMinLength"))
      .max(100, t("passwordMaxLength")),
    confirmPassword: z.string().min(1, t("passwordConfirm")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("passwordsDoNotMatch"),
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const v = useTranslations("auth.validations");
  const f = useTranslations("auth.form");
  const n = useTranslations("auth.notifications");

  const registerSchema = createRegisterSchema(v);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          username: values.username,
          password: values.password,
          displayName: values.displayName || values.username,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || n("registerFailed"));
      }

      toast.success(n("registerSuccess"));

      // Auto login
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(n("loginFailedAfterRegister"));
      }

      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      if(error instanceof Error) {
        toast.error(n("somethingWentWrong") + ": " + error.message);
      } else {
        toast.error(n("somethingWentWrong"));
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{f("username")}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={f("usernamePlaceholder")}
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
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{f("displayName")}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={f("displayNamePlaceholder")}
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{f("confirmPassword")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={f("confirmPasswordPlaceholder")}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? f("loadingRegister") : f("submitRegister")}
        </Button>
      </form>
    </Form>
  );
}
