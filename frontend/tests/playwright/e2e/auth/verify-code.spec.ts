import { shouldGotoVerifyCodePage } from "@/app/(auth)/verify-code/[id]/stories";
import { runSimilarTests } from "@/tests/playwright/utils/dsl";
import { test } from "@playwright/test";

test.describe("Verify code tests", () => {
  runSimilarTests([
    ["should go to Verify code page", shouldGotoVerifyCodePage],
  ]);
});
