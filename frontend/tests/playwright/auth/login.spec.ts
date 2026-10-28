import { shouldGotoLoginPage } from "@/app/(auth)/login/stories";
import { test } from "@playwright/test";
import { runSimilarTests } from "@vickbk/tests/playwright";

test.describe("Login tests", () => {
  runSimilarTests(["should go to login page", shouldGotoLoginPage]);
});
