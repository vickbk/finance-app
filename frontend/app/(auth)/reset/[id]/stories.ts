import { shouldSeeResetPasswordFormContent } from "@/features/auth/__testing__";
import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import { shouldHaveTitleAndContent } from "../../stories";

export async function shouldGotoResetPasswordPage(page: Page) {
  await page.goto("/reset/test-id");

  await shouldHaveTitleAndContent(page, "Create a new password");
  await shouldSeeResetPasswordFormContent(page);
  await shouldSee(page, "Remember your password?", "Login here");
}
