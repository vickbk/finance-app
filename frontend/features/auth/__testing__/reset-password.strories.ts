import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";

export async function shouldSeeResetPasswordFormContent(page: Page) {
  await shouldSee(
    page,
    "reset your password",
    "New password",
    "Must be at least 8 characters long.",
    "confirm password",
    "reset password",
  );
}
