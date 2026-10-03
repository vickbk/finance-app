import { shouldSeeGoogleSignIn } from "@/features/auth/__testing__";
import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import { shouldHaveTitleAndContent } from "../layout.stories";

export async function shouldGotoSignupPage(page: Page) {
  await page.goto("/signup");

  await shouldHaveTitleAndContent(page, "Create an account");

  await shouldSeeGoogleSignIn(page);
  await shouldSee(page, "Don't have an account?", "Create an account here");
}
