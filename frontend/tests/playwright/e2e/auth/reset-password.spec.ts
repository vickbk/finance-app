import { shouldGotoResetPasswordPage } from "@/app/(auth)/reset/[id]/stories";
import { runSimilarTests } from "@/tests/playwright/utils/dsl";
import { test } from "@playwright/test";

test.describe("Reset password tests", () => {
  runSimilarTests([
    ["should go to reset password page", shouldGotoResetPasswordPage],
  ]);
});
