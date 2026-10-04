import {
  shouldSeeGoogleSignIn,
  shouldSeeLoginFormContent,
} from "@/features/auth/__testing__";
import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";
import { shouldHaveTitleAndContent } from "../stories";
import { metadata } from "./page";

export async function shouldGotoLoginPage(page: Page) {
  await page.goto("/login");

  await shouldHaveTitleAndContent(page, metadata.title as string);
  await shouldSeeLoginFormContent(page);
  await shouldSeeGoogleSignIn(page);
  await shouldSee(page, "Don't have an account?", "Create an account here");
}
