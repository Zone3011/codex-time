import { test, expect } from "@playwright/test";

test("closing parallax follows scroll and resets for reduced motion", async ({
  page,
}) => {
  await page.goto("/#contact");
  const panel = page.locator(".closing-parallax");
  await expect
    .poll(() =>
      panel.evaluate((node) =>
        (node as HTMLElement).style.getPropertyValue("--closing-drift"),
      ),
    )
    .not.toBe("");
  const before = await panel.evaluate((node) =>
    (node as HTMLElement).style.getPropertyValue("--closing-drift"),
  );
  await page.evaluate(() => window.scrollBy(0, -100));
  await expect
    .poll(() =>
      panel.evaluate((node) =>
        (node as HTMLElement).style.getPropertyValue("--closing-drift"),
      ),
    )
    .not.toBe(before);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      panel.evaluate((node) =>
        (node as HTMLElement).style.getPropertyValue("--closing-drift"),
      ),
    )
    .toBe("");
  await page
    .locator("#contact")
    .screenshot({ path: "test-results/closing-desktop.png" });
  await page.getByRole("link", { name: "Back to top" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});

test("footer email and closing work without JavaScript on mobile", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 740 },
  });
  const page = await context.newPage();
  await page.goto("/#contact");
  await expect(page.getByRole("link", { name: "Email me" })).toHaveAttribute(
    "href",
    "mailto:niravpatel1422004@gmail.com",
  );
  await expect(
    page
      .getByRole("contentinfo")
      .getByRole("link", { name: "niravpatel1422004@gmail.com" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/closing-mobile.png",
    fullPage: false,
  });
  await context.close();
});
