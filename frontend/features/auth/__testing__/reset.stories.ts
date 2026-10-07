import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";

export async function shouldSeeSendResetCodeFormContent(page: Page) {
  await shouldSee(
    page,
    "Reset password",
    "email",
    "We'll send a verification code to this address.",
    "Send verification code",
  );
}
