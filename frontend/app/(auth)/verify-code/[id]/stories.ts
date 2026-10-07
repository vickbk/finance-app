import { shouldSeeVerifyCodeFormContent } from "@/features/auth/__testing__";
import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import { shouldHaveTitleAndContent } from "../../stories";

export async function shouldGotoVerifyCodePage(page: Page) {
  await page.goto("/verify-code/test-id");

  await shouldHaveTitleAndContent(page, "Verify reset code");
  await shouldSeeVerifyCodeFormContent(page);
  await shouldSee(page, "Remember your password?", "Login here");
}
