import {
  shouldSeeGoogleSignIn,
  shouldSeeSignupFormContent,
} from "@/features/auth/__testing__";
import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import { shouldHaveTitleAndContent } from "../stories";
import { metadata } from "./page";

export async function shouldGotoSignupPage(page: Page) {
  await page.goto("/signup");

  await shouldHaveTitleAndContent(page, metadata.title as string);

  await shouldSeeSignupFormContent(page);
  await shouldSeeGoogleSignIn(page);
  await shouldSee(page, "Already have an account?", "Login Here");
}
