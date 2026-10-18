import { test, expect } from "@playwright/test";
test("desktop content, disclosure, and contact", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByText("About this concept").first().click();
  await expect(
    page
      .getByText("This is an illustrative portfolio placeholder", {
        exact: false,
      })
      .first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "hello@example.com" }),
  ).toHaveAttribute("href", "mailto:hello@example.com");
  expect(errors).toEqual([]);
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
});
test("mobile menu keyboard interaction and overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: /Menu|Close/ });
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#about$/);
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("reduced motion preserves hero and disables smooth scrolling", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});
test("narrow mobile, tablet, and desktop layouts fit", async ({ page }) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
});
