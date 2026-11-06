import { shouldGotoResetPasswordPage } from "@/app/(auth)/reset/[id]/stories";
import { test } from "@playwright/test";
import { runSimilarTests } from "@vickbk/tests/playwright";

test.describe("Reset password tests", () => {
  runSimilarTests([
    "should go to reset password page",
    shouldGotoResetPasswordPage,
  ]);
});
