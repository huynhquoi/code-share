"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
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
import { useAsync } from "@/hooks/use-async";
import { apiClient } from "@/lib/api-client";
import { LoadingButton } from "../custom-ui/loading-button";
import { getAuthErrorMessage } from "@/lib/utils";

export const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      email: z.string().min(1, t("requiredEmail")).email(t("invalidEmail")),
      username: z
        .string()
        .min(3, t("usernameMinLength"))
        .max(20, t("usernameMaxLength"))
        .regex(/^[a-zA-Z0-9_]+$/, t("usernameContains")),
      displayName: z.string().max(50, t("displayNameMaxLength")).optional(),
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

  const v = useTranslations("auth.validations");
  const f = useTranslations("auth.form");
  const n = useTranslations("auth.notifications");

  const registerSchema = createRegisterSchema(v);

  const { execute, isLoading } = useAsync({
    showSuccessToast: false,
    showErrorToast: false,
  });

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
    await execute(async () => {
      try {
        await apiClient.post("/auth/register", {
          email: values.email,
          username: values.username,
          password: values.password,
          displayName: values.displayName || values.username,
        });

        toast.success(n("registerSuccess"));

        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error(n("loginFailedAfterRegister"));
          router.push("/login");
          return;
        }

        router.push("/");
        router.refresh();
      } catch (error) {
        const message = getAuthErrorMessage(error, n);
        toast.error(message);
        throw error; // Re-throw to let useAsync handle loading state
      }
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

        <LoadingButton
          type="submit"
          className="w-full"
          isLoading={isLoading}
          loadingText={f("loadingRegister")}
        >
          {f("submitRegister")}
        </LoadingButton>
      </form>
    </Form>
  );
}
