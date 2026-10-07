import { shouldGotoLoginPage } from "@/app/(auth)/login/stories";
import { runSimilarTests } from "@/tests/playwright/utils/dsl";
import { test } from "@playwright/test";

test.describe("Login tests", () => {
  runSimilarTests([["should go to login page", shouldGotoLoginPage]]);
});
