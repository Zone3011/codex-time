import { test, expect } from "@playwright/test";

for (const variant of ["Ink", "Glitch", "Ripple", "Sweep"]) {
  test(`${variant} switches both themes with a real snapshot animation and cleanup`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/#contact");
    await page.locator(".theme-lab summary").click();
    await page.getByRole("button", { name: variant, exact: true }).click();
    await page.getByRole("button", { name: "Preview dark" }).click();
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme-effect",
      variant.toLowerCase(),
    );
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .some(
          (animation) =>
            (animation.effect as KeyframeEffect)?.pseudoElement ===
            "::view-transition-new(root)",
        ),
    );
    await page.waitForTimeout(220);
    await page.screenshot({
      path: `test-results/theme-${variant.toLowerCase()}-active.png`,
    });
    await expect(
      page.getByRole("button", { name: "Preview light" }),
    ).toBeEnabled();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme-effect");
    if (variant === "Ink") {
      await page.screenshot({ path: "test-results/theme-dark-desktop.png" });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.locator(".theme-lab summary").click();
      await page.screenshot({ path: "test-results/theme-dark-header.png" });
      await page.locator(".theme-lab summary").click();
    }
    await page.getByRole("button", { name: "Preview light" }).click();
    await expect(
      page.getByRole("button", { name: "Preview dark" }),
    ).toBeEnabled();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(errors).toEqual([]);
  });
}

test("reduced motion and unsupported browsers switch themes without animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/#contact");
  await page.locator(".theme-lab summary").click();
  await page.getByRole("button", { name: "Preview dark" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).not.toHaveAttribute("data-theme-effect");
  await page.screenshot({ path: "test-results/theme-dark-mobile.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() =>
    Object.defineProperty(document, "startViewTransition", {
      value: undefined,
      configurable: true,
    }),
  );
  await page.getByRole("button", { name: "Preview light" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
