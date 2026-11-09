import { test, expect } from "@playwright/test";

test("desktop presents two company pages as an open book", async ({ page }) => {
  await page.goto("/#experience");
  const book = page.locator(".memory-reader");
  await expect(
    book.getByRole("heading", { name: "Sedani Digital", exact: true }),
  ).toBeVisible();
  await expect(
    book.getByRole("heading", { name: "hfiles", exact: true }),
  ).toBeVisible();
  await expect(
    book.getByRole("heading", { name: "Intern Software Developer" }),
  ).toBeVisible();
  await expect(
    book.getByRole("heading", { name: "Web Developer", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("tablist", { name: "Company pages" }),
  ).not.toBeVisible();
  await page
    .locator(".experience-section")
    .screenshot({ path: "test-results/book-desktop.png" });
});

test("mobile page turns support keyboard tabs, boundaries and clean interruption", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#experience");
  const sedani = page.getByRole("tab", { name: "Sedani Digital" });
  const hfiles = page.getByRole("tab", { name: "hfiles" });
  await expect(sedani).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("button", { name: "Previous page" }),
  ).toBeDisabled();
  await sedani.focus();
  await page.keyboard.press("ArrowRight");
  await expect(hfiles).toBeFocused();
  await expect(hfiles).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel", { name: "hfiles" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Next page" })).toBeDisabled();
  await expect(page.locator(".turn-leaf")).toHaveCount(0);
  await page.keyboard.press("Home");
  await expect(sedani).toBeFocused();
  await expect(
    page.getByRole("tabpanel", { name: "Sedani Digital" }),
  ).toBeVisible();
  await hfiles.click();
  await sedani.click();
  await expect(page.locator(".turn-leaf")).toHaveCount(0);
  await expect(
    page.getByRole("tabpanel", { name: "Sedani Digital" }),
  ).toBeVisible();
  await page
    .locator(".book-desk")
    .screenshot({ path: "test-results/book-mobile-sedani.png" });
  await hfiles.click();
  await expect(page.locator(".turn-leaf")).toHaveCount(0);
  await page
    .locator(".book-desk")
    .screenshot({ path: "test-results/book-mobile-hfiles.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("book respects the shared pause setting and live reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Pause motion" }).click();
  await page.getByRole("tab", { name: "hfiles" }).click();
  await expect(page.getByRole("tabpanel", { name: "hfiles" })).toBeVisible();
  await expect(page.locator(".turn-leaf")).toHaveCount(0);
  await page.getByRole("button", { name: "Resume motion" }).click();
  await page.getByRole("tab", { name: "Sedani Digital" }).click();
  await expect(page.locator(".turn-leaf")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".turn-leaf")).toHaveCount(0);
  await page.getByRole("tab", { name: "hfiles" }).click();
  await expect(page.getByRole("tabpanel", { name: "hfiles" })).toBeVisible();
  await expect(page.locator(".turn-leaf")).toHaveCount(0);
});

test("both company pages remain readable without JavaScript on a narrow phone", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 740 },
  });
  const page = await context.newPage();
  await page.goto("/#experience");
  await expect(
    page.getByRole("heading", { name: "Sedani Digital", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "hfiles", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});
