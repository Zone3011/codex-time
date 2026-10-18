import { test, expect } from "@playwright/test";
test("six chapters, real identity, and direct contact", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle(/Nirav Patel/);
  await expect(page.locator("main > section")).toHaveCount(6);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Nirav");
  await expect(
    page.getByRole("link", { name: /niravpatel1422004@gmail.com/ }),
  ).toHaveAttribute("href", "mailto:niravpatel1422004@gmail.com");
  await page.getByRole("button", { name: /Explore the connections/ }).click();
  await expect(
    page.getByRole("button", { name: /Bring it together/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".hero-copy .pill-link")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "test-results/hero-desktop.png" });
  await page.evaluate(() =>
    window.scrollTo({ top: window.innerHeight * 0.45, behavior: "instant" }),
  );
  await expect
    .poll(async () =>
      Number(
        await page
          .locator(".hero-copy")
          .evaluate((el) => getComputedStyle(el).opacity),
      ),
    )
    .toBeLessThan(0.9);
  await expect(page.locator(".site-header")).toBeInViewport();
  await page.screenshot({ path: "test-results/opening-scroll.png" });
  expect(errors).toEqual([]);
});
test("physics controls and keyboard-accessible skill transitions", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#play");
  const shuffle = page.getByRole("button", { name: /Shuffle/ });
  await expect(shuffle).toBeEnabled();
  await shuffle.click();
  const gravity = page.getByRole("button", { name: /Reverse gravity/ });
  await gravity.click();
  await expect(gravity).toHaveAttribute("aria-pressed", "true");
  await page.locator("#play").screenshot({ path: "test-results/physics.png" });
  await page.locator("#skills").scrollIntoViewIfNeeded();
  const php = page.getByRole("tab", { name: /PHP/ });
  await php.click();
  await expect(page.getByRole("tabpanel")).toContainText("server side");
  await php.press("ArrowDown");
  await expect(page.getByRole("tab", { name: /Flutter/ })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("mobile side");
  await page.locator("#skills").screenshot({ path: "test-results/skills.png" });
  expect(errors).toEqual([]);
});
test("optional guide changes context and can be dismissed and restored", async ({
  page,
}) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /Open section guide/ });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(page.locator("#guide-description")).toContainText("GSAP");
  await page.locator("#skills").scrollIntoViewIfNeeded();
  await expect(page.locator("#guide-description")).toContainText("Motion");
  await page.getByRole("button", { name: /Hide guide for now/ }).click();
  await expect(page.locator("#guide-toggle")).toHaveCount(0);
  await page.getByRole("button", { name: /Show guide/ }).click();
  await expect(page.locator("#guide-toggle")).toBeVisible();
});
test("global motion pause and system reduced motion", async ({ page }) => {
  await page.goto("/");
  const pause = page.getByRole("button", { name: "Pause animations" });
  await pause.click();
  await expect(pause).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".experience")).toHaveClass(/motion-paused/);
  await page.locator("#play").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("button", { name: /Reverse gravity/ }),
  ).toBeDisabled();
  await page.emulateMedia({ reducedMotion: "reduce" });

  await expect(
    page.getByRole("button", { name: "Reduced motion enabled" }),
  ).toBeDisabled();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /One last little thing/ }).click();
  await expect(page.getByRole("status")).toContainText(
    "Thanks for stopping by",
  );
});
test("3D scene or graceful device fallback, with finish controls", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#world");
  await expect(page.locator(".world-stage")).toBeVisible();
  await expect(
    page.locator(".world-stage canvas, .world-fallback"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Jade", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Jade", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  const rotation = page.getByRole("slider", { name: "Turn the sculpture" });
  await rotation.fill("90");
  await expect(rotation).toHaveValue("90");
  await page.locator("#world").screenshot({ path: "test-results/world.png" });
  expect(errors).toEqual([]);
});
test("mobile keyboard navigation, Escape, and responsive overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: /Menu|Close −/ });
  await menu.focus();
  await menu.press("Enter");
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  const story = page
    .getByRole("navigation")
    .getByRole("link", { name: "Story", exact: true });
  await story.focus();
  await story.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await story.click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#about$/);
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
});
test("contact celebration is opt-in and copy provides feedback", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#contact");
  await page.getByRole("button", { name: /Copy email/ }).click();
  await expect(page.getByRole("status")).toContainText("Email copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "niravpatel1422004@gmail.com",
  );
  await page.getByRole("button", { name: /One last little thing/ }).click();
  await expect(page.getByRole("status")).toContainText(
    "Thanks for stopping by",
  );
});
