import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";

export async function shouldSeeLayoutContent(page: Page) {
  await shouldSee(
    page,
    "Welcome to the Finance App! Authenticate with your account here.",
    ["finance", 1],
    "Keep track of your money and save for your future.",
    "Personal finance app puts you in control of your spendings. Track transactions, set budgets and add to saving pots easily.",
  );
}
