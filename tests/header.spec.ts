import { test, expect } from "@playwright/test";

test("swarm completes and restores interactive header", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".swarm-layer")).toHaveCount(0, { timeout: 8000 });
  await expect(page.getByRole("link", { name: /Let’s talk/ })).toHaveAttribute("href", "mailto:niravpatel1422004@gmail.com");
  expect(await page.locator(".site-header").evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
});

test("pause clears the intro and supports resuming", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(page.locator(".swarm-layer")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Resume motion" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Resume motion" }).click();
  await expect(page.getByRole("button", { name: "Pause motion" })).toHaveAttribute("aria-pressed", "false");
});

test("reduced motion and mobile keep content visible without overflow", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".swarm-layer")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Nirav Patel home" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("header remains usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Let’s talk/ })).toBeVisible();
  await context.close();
});

test("live reduced motion cancels the entrance", async ({ page }) => {
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".swarm-layer")).toHaveCount(0);
  expect(await page.locator(".site-header").evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
});

test("desktop and mobile screenshots", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".swarm-layer")).toHaveCount(0, { timeout: 8000 });
  await page.screenshot({ path: "test-results/header-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/header-mobile.png" });
});
