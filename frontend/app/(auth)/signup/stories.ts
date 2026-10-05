import {
  shouldSeeGoogleSignIn,
  shouldSeeSignupFormContent,
} from "@/features/auth/__testing__";
import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import { shouldHaveTitleAndContent } from "../stories";

export async function shouldGotoSignupPage(page: Page) {
  await page.goto("/signup");

  await shouldHaveTitleAndContent(page, "Create an account");

  await shouldSeeSignupFormContent(page);
  await shouldSeeGoogleSignIn(page);
  await shouldSee(page, "Already have an account?", "Login Here");
}
