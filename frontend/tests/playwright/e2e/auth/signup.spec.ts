import { shouldGotoSignupPage } from "@/app/(auth)/signup/stories";
import { runSimilarTests } from "@/tests/playwright/utils/dsl";
import { test } from "@playwright/test";

test.describe("Sign up tests", () => {
  runSimilarTests([["should go to signup page", shouldGotoSignupPage]]);
});
