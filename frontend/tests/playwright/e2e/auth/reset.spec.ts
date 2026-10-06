import { shouldGotoSendResetCodePage } from "@/app/(auth)/reset/stories";
import { runSimilarTests } from "@/tests/playwright/utils/dsl";
import { test } from "@playwright/test";

test.describe("Reset code tests", () => {
  runSimilarTests([
    ["should go to send reset code", shouldGotoSendResetCodePage],
  ]);
});
