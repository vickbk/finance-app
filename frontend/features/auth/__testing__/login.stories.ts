import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";

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
