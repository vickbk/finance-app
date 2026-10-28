import {
  shouldSeeGoogleSignIn,
  shouldSeeLoginFormContent,
} from "@/features/auth/__testing__";
import { Page } from "@playwright/test";
import { shouldSee } from "@vickbk/tests/playwright";
import { shouldHaveTitleAndContent } from "../stories";

export async function shouldGotoLoginPage(page: Page) {
  await page.goto("/login");

  await shouldHaveTitleAndContent(page, "Login to your account");
  await shouldSeeLoginFormContent(page);
  await shouldSeeGoogleSignIn(page);
  await shouldSee(page, "Don't have an account?", "Create an account here");
}
