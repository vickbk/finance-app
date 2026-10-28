import { Page } from "@playwright/test";
import { shouldSee } from "@vickbk/tests/playwright";

export async function shouldSeeGoogleSignIn(page: Page) {
  await shouldSee(page, "Or continue with Google", "Sign in with Google");
}
