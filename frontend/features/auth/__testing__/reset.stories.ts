import { Page } from "@playwright/test";
import { shouldSee } from "@vickbk/tests/playwright";

export async function shouldSeeSendResetCodeFormContent(page: Page) {
  await shouldSee(
    page,
    "Reset password",
    "email",
    "We'll send a verification code to this address.",
    "Send verification code",
  );
}
