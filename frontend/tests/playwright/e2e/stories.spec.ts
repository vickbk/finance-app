import { test } from "@playwright/test";

test.describe("Page should start", () => {
  test("Open page", async ({ page }) => {
    await page.goto("/");
  });
});
