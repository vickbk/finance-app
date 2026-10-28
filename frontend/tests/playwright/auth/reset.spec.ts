import { shouldGotoSendResetCodePage } from "@/app/(auth)/reset/stories";
import { test } from "@playwright/test";
import { runSimilarTests } from "@vickbk/tests/playwright";

test.describe("Reset code tests", () => {
  runSimilarTests([
    "should go to send reset code",
    shouldGotoSendResetCodePage,
  ]);
});
