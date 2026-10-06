import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";

export async function shouldSeeVerifyCodeFormContent(page: Page) {
  await shouldSee(
    page,
    ["verify code", 0],
    ["verify code", 1],
    "verification code",
    "Enter the 6-digit code sent to your email address.",
  );
}
