import { test, expect } from "@playwright/test";

test("keychains arrive on scroll once and reduced motion clears a live swing", async ({
  page,
}) => {
  await page.goto("/");
  const cards = page.locator(".skill-keychain");
  await expect(cards.first()).not.toHaveAttribute("data-arrived", "true");
  await cards.first().evaluate((card) => {
    const box = card.getBoundingClientRect();
    window.scrollTo(0, scrollY + box.top + box.height / 2 - innerHeight * 0.8);
  });
  await page.waitForTimeout(500);
  await expect(cards.first()).not.toHaveAttribute("data-arrived", "true");
  await cards.first().evaluate((card) => {
    const box = card.getBoundingClientRect();
    window.scrollTo(0, scrollY + box.top + box.height / 2 - innerHeight / 2);
  });
  await expect(cards.first()).toHaveAttribute("data-arrived", "true");
  await page.waitForFunction(
    () => document.querySelector(".skill-keychain")!.getAnimations().length > 0,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      cards.evaluateAll((nodes) =>
        nodes.reduce((sum, node) => sum + node.getAnimations().length, 0),
      ),
    )
    .toBe(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect
    .poll(() => cards.first().evaluate((node) => node.getAnimations().length))
    .toBeGreaterThan(0);
  await expect
    .poll(() => cards.first().evaluate((node) => node.getAnimations().length))
    .toBe(0);
  await page.evaluate(() => window.scrollBy(0, -400));
  await cards.first().evaluate((card) => {
    const box = card.getBoundingClientRect();
    window.scrollTo(0, scrollY + box.top + box.height / 2 - innerHeight / 2);
  });
  await page.waitForTimeout(450);
  expect(
    await cards.first().evaluate((node) => node.getAnimations().length),
  ).toBe(0);
  await page
    .locator("#skills")
    .screenshot({ path: "test-results/skills-desktop.png" });
});

test("mobile toolkit stays readable with JavaScript disabled", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 740 },
  });
  const page = await context.newPage();
  await page.goto("/#skills");
  for (const name of [
    "WordPress",
    "PHP",
    "Flutter",
    ".NET",
    "Next.js",
    "SEO",
  ]) {
    await expect(
      page.locator("#skills").getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .locator("#skills")
    .screenshot({ path: "test-results/skills-mobile.png" });
  await context.close();
});
