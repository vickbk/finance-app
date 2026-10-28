import { shouldGotoVerifyCodePage } from "@/app/(auth)/verify-code/[id]/stories";
import { test } from "@playwright/test";
import { runSimilarTests } from "@vickbk/tests/playwright";

test.describe("Verify code tests", () => {
  runSimilarTests(["should go to Verify code page", shouldGotoVerifyCodePage]);
});
