import {
  shouldSeeGoogleSignIn,
  shouldSeeSendResetCodeFormContent,
} from "@/features/auth/__testing__";
import { Page } from "@playwright/test";
import { shouldSee } from "@vickbk/tests/playwright";
import { shouldHaveTitleAndContent } from "../stories";

export async function shouldGotoSendResetCodePage(page: Page) {
  await page.goto("/reset");

  await shouldHaveTitleAndContent(page, "Reset your password");
  await shouldSeeSendResetCodeFormContent(page);
  await shouldSeeGoogleSignIn(page);
  await shouldSee(page, "Remember your password?", "Login here");
}
