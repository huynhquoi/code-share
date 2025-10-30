import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAuthErrorMessage(
  error: unknown,
  t: (key: string) => string
): string {
  if (error instanceof Error) {
    const message = error.message;

    if (message.includes("Email already exists"))
      return t("emailAlreadyExists");
    if (message.includes("Username already exists"))
      return t("usernameAlreadyExists");
    if (message.includes("Invalid credentials")) return t("invalidCredentials");

    return t("registerFailed") + ": " + message;
  }

  return t("somethingWentWrong");
}
