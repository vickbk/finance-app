import { Page } from "@playwright/test";
import { shouldSee } from "@vickbk/tests/playwright";

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
