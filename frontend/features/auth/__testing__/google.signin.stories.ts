import { shouldSee } from "@/tests/playwright";
import { Page } from "@playwright/test";

export async function shouldSeeGoogleSignIn(page: Page) {
  await shouldSee(page, "Or continue with Google", "Sign in with Google");
}
