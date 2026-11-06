import { Page } from "@playwright/test";
import { shouldSee } from "@vickbk/tests/playwright";

export async function shouldSeeSignupFormContent(page: Page) {
  await shouldSee(
    page,
    "sign up",
    "name",
    "email",
    ["password", 0],
    "password must be at least 8 characters",
    "create account",
  );
}
