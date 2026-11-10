import { test, expect } from "@playwright/test";

test("detailed ink switches both directions at a readable pace and cleans up", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .some(
        (a) =>
          (a.effect as KeyframeEffect)?.pseudoElement ===
          "::view-transition-new(root)",
      ),
  );
  const ink = await page.evaluate(() => {
    const animation = document
      .getAnimations()
      .find(
        (a) =>
          (a.effect as KeyframeEffect)?.pseudoElement ===
          "::view-transition-new(root)",
      )!;
    const effect = animation.effect as KeyframeEffect;
    return {
      duration: effect.getTiming().duration,
      frames: effect.getKeyframes().length,
      mask: effect.getKeyframes()[8].clipPath as string,
    };
  });
  expect(ink.duration).toBe(2300);
  expect(ink.frames).toBe(17);
  expect(ink.mask.startsWith("path(")).toBe(true);
  await page.waitForTimeout(700);
  await page.screenshot({ path: "test-results/ink-detailed-active.png" });
  await expect(
    page.getByRole("button", { name: "Switch to light mode" }),
  ).toBeEnabled();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme-effect");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(
    page.getByRole("button", { name: "Switch to dark mode" }),
  ).toBeEnabled();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768, 1440]) {
  test(`all sections and dialog adapt to both themes at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    for (const theme of ["dark", "light"]) {
      await page
        .getByRole("button", { name: `Switch to ${theme} mode` })
        .click();
      for (const id of [
        "home",
        "experience",
        "projects",
        "skills",
        "contact",
      ]) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.locator(`#${id}`).screenshot({
          path: `test-results/theme-${theme}-${id}-${width}.png`,
        });
        if (id === "experience") {
          await page.getByRole("tab", { name: "hfiles" }).click();
          if (width <= 760)
            await page
              .getByRole("button", { name: "Next page", exact: true })
              .click();
          await page
            .locator("#experience")
            .screenshot({
              path: `test-results/theme-${theme}-hfiles-${width}.png`,
            });
          await page.getByRole("tab", { name: "Sedani Digital" }).click();
        }
      }
      if (theme === "dark") {
        // Dark material controls need light text; company brand cards retain their own palette.
        for (const selector of [
          ".role-note h4",
          ".book-pagination button:not(:disabled)",
          ".project-copy h3",
          ".skills-copy h2",
        ]) {
          const color = await page
            .locator(selector)
            .first()
            .evaluate((node) => getComputedStyle(node).color);
          const channels = color.match(/\d+/g)!.map(Number);
          expect(Math.max(...channels.slice(0, 3))).toBeGreaterThan(180);
        }
      }
      await page.getByRole("link", { name: "Let’s talk" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.getByRole("dialog").screenshot({
        path: `test-results/theme-${theme}-dialog-${width}.png`,
      });
      await page.keyboard.press("Escape");
    }
  });
}

test("live reduced motion cancels ink and unsupported browsers still switch", async ({
  page,
}) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-effect",
    "ink",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", { name: "Switch to light mode" }),
  ).toBeEnabled();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme-effect");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() =>
    Object.defineProperty(document, "startViewTransition", {
      value: undefined,
      configurable: true,
    }),
  );
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
