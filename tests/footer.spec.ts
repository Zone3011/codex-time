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
  const relativeDepth = () =>
    panel.evaluate((node) => {
      const note = node.querySelector(".closing-note")!.getBoundingClientRect();
      const ring = node
        .querySelector(".closing-orbit-line")!
        .getBoundingClientRect();
      return note.top - ring.top;
    });
  const depthBefore = await relativeDepth();
  await page.evaluate(() => window.scrollBy(0, -200));
  await expect
    .poll(() =>
      panel.evaluate((node) =>
        (node as HTMLElement).style.getPropertyValue("--closing-drift"),
      ),
    )
    .not.toBe(before);
  await expect
    .poll(async () => Math.abs((await relativeDepth()) - depthBefore))
    .toBeGreaterThan(40);
  await page.screenshot({ path: "test-results/closing-parallax-active.png" });
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
