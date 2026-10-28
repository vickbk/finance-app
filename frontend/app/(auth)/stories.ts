import { shouldSeeLayoutContent } from "@/features/auth/modules/layout/__testing__";
import { expect, Page } from "@playwright/test";

export async function shouldHaveTitleAndContent(page: Page, prefix?: string) {
  await expect(page).toHaveTitle(
    prefix
      ? `${prefix} | Finance App Authentication`
      : "Finance App Authentication",
  );

  await shouldSeeLayoutContent(page);
}
