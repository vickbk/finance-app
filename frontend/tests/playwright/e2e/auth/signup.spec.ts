import { shouldGotoSignupPage } from "@/app/(auth)/signup/stories";
import { test } from "@playwright/test";
import { runSimilarTests } from "@vickbk/tests/playwright";

test.describe("Sign up tests", () => {
  runSimilarTests(["should go to signup page", shouldGotoSignupPage]);
});
