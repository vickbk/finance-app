import { Page } from "@playwright/test";
import { shouldSee } from "@vickbk/tests/playwright";

export async function shouldSeeLoginFormContent(page: Page) {
  await shouldSee(
    page,
    ["Login", 0],
    "email",
    ["password", 0],
    "forgot password?",
    "reset it here",
    ["Login", 1],
  );
}
