import { test, expect, type Page } from "@playwright/test";
async function frameSection(page: Page, id: string) {
  await page
    .locator("#" + id)
    .evaluate((el) =>
      el.scrollIntoView({ block: "start", behavior: "instant" }),
    );
  await expect(page.locator(".experience")).toHaveAttribute("data-chapter", id);
  await expect(page.locator(".experience")).toHaveCSS(
    "background-color",
    id === "skills" || id === "world"
      ? "rgb(13, 26, 41)"
      : "rgb(243, 246, 248)",
  );
  if (id === "about") {
    await expect(page.locator(".about-note")).toHaveAttribute(
      "data-reveal-state",
      "complete",
    );
    await expect(page.locator(".about-note")).toHaveCSS("opacity", "1");
  }
}
test("personal introduction and live scene render without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      message.text().includes("THREE.WebGLProgram")
    )
      errors.push(message.text());
  });
  await page.goto("/");
  await expect(page).toHaveTitle(/Nirav Patel/);
  await expect(page.locator("main > section")).toHaveCount(5);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Nirav");
  await expect(page.locator(".intro-actions")).toHaveCSS("opacity", "1");
  await expect(page.locator(".journey-world canvas")).toHaveAttribute(
    "data-rendered",
    "true",
  );
  await expect(page.locator(".intro-copy h1")).toHaveCSS("opacity", "1");
  await expect(page.locator(".intro-actions")).toHaveCSS("opacity", "1");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "test-results/intro-desktop.png" });
  expect(errors).toEqual([]);
});
test("technology tabs support selection and arrow-key navigation", async ({
  page,
}) => {
  await page.goto("/#skills");
  const php = page.getByRole("tab", { name: /PHP/ });
  await php.click();
  await expect(php).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("server side");
  await php.press("ArrowDown");
  await expect(page.getByRole("tab", { name: /Flutter/ })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("mobile side");
  await frameSection(page, "skills");
  await expect(page.locator(".section-heading")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "test-results/toolkit-desktop.png" });
});
test("particle formations and perspective control respond", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#world");
  await expect(
    page.getByRole("button", { name: "Orbit", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Structure", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Structure", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Scatter", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Scatter", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  const slider = page.getByRole("slider", { name: "Change your perspective" });
  await slider.fill("90");
  await expect(slider).toHaveValue("90");
  await frameSection(page, "world");
  await expect(page.locator(".lab-heading")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "test-results/lab-desktop.png" });
  expect(errors).toEqual([]);
});
test("floating navigation stays visible and follows the journey", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Explore my world/ }).click();
  await expect(page).toHaveURL(/#world$/);
  await expect(
    page
      .getByRole("navigation")
      .getByRole("link", { name: "Explore", exact: true }),
  ).toHaveAttribute("aria-current", "location");
  await expect(page.locator(".site-header")).toBeInViewport();
  const bounds = await page.locator(".site-header").boundingBox();
  expect(bounds?.y).toBeGreaterThanOrEqual(0);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page.locator("#about")).toBeInViewport();
  await frameSection(page, "about");
  await expect(page.locator(".about-note")).toHaveAttribute(
    "data-reveal-state",
    "complete",
  );
  await page.screenshot({ path: "test-results/about-desktop.png" });
});
test("mobile menu, Escape, and narrow-screen layout work", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: /Menu|Close −/ });
  await menu.focus();
  await menu.press("Enter");
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  const about = page
    .getByRole("navigation")
    .getByRole("link", { name: "About", exact: true });
  await about.focus();
  await about.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await about.click();
  await expect(page).toHaveURL(/#about$/);
  await frameSection(page, "about");
  await page.screenshot({ path: "test-results/about-mobile.png" });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: "test-results/intro-mobile.png" });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
});
test("global pause and live reduced-motion preference retain controls", async ({
  page,
}) => {
  await page.goto("/");
  const pause = page.getByRole("button", { name: "Pause animations" });
  await pause.click();
  await expect(pause).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".experience")).toHaveClass(/motion-paused/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", { name: "Reduced motion enabled" }),
  ).toBeDisabled();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await page.locator("#world").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Structure", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Structure", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("email destination and clipboard feedback are correct", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#contact");
  await expect(
    page.getByRole("link", { name: /niravpatel1422004@gmail.com/ }),
  ).toHaveAttribute("href", "mailto:niravpatel1422004@gmail.com");
  await page.getByRole("button", { name: /Copy email/ }).click();
  await expect(page.getByRole("status")).toContainText("Email copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "niravpatel1422004@gmail.com",
  );
  await page.screenshot({ path: "test-results/contact-desktop.png" });
});
test("WebGL failure falls back without losing the portfolio", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: function (
        this: HTMLCanvasElement,
        type: string,
        ...rest: unknown[]
      ) {
        if (type.includes("webgl")) return null;
        return Reflect.apply(original, this, [type, ...rest]);
      },
    });
  });
  await page.goto("/");
  await expect(page.locator(".scene-fallback")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Nirav");
  await expect(page.locator("main > section")).toHaveCount(5);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("link", { name: /niravpatel1422004@gmail.com/ }),
  ).toBeVisible();
});
test("personal content and contact remain usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Nirav");
  await expect(
    page.getByRole("link", { name: /niravpatel1422004@gmail.com/ }),
  ).toHaveAttribute("href", "mailto:niravpatel1422004@gmail.com");
  await expect(page.getByRole("tabpanel")).toContainText("WordPress");
  await context.close();
});

test("small wheel gestures advance chapters without skipping tall content", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".journey-world canvas")).toHaveAttribute(
    "data-rendered",
    "true",
  );
  await page.mouse.move(700, 400);
  await page.mouse.wheel(0, 45);
  await expect
    .poll(() => page.evaluate(() => Math.round(scrollY)))
    .toBeGreaterThan(300);
  await expect(page.locator(".experience")).toHaveAttribute(
    "data-chapter",
    "about",
  );
  await expect
    .poll(() =>
      page.evaluate(() =>
        Math.abs(scrollY - (document.getElementById("about")!.offsetTop - 110)),
      ),
    )
    .toBeLessThan(3);
  // A fresh reverse gesture returns to the previous chapter.
  await page.waitForTimeout(1100);
  await page.mouse.wheel(0, -45);
  await expect
    .poll(() => page.evaluate(() => Math.round(scrollY)))
    .toBeLessThan(3);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".experience")).toHaveClass(/motion-paused/);
  await page.mouse.wheel(0, 45);
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => scrollY)).toBeLessThan(150);
});

test("wheel scrolling can read the middle of a tall chapter", async ({
  page,
}) => {
  await page.goto("/#skills");
  await expect(page.locator(".journey-world canvas")).toHaveAttribute(
    "data-rendered",
    "true",
  );
  await page.setViewportSize({ width: 390, height: 640 });
  await page
    .locator("#skills")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  const start = await page.evaluate(() => scrollY);
  await page.mouse.move(180, 350);
  await page.mouse.wheel(0, 50);
  await page.waitForTimeout(450);
  const end = await page.evaluate(() => scrollY);
  expect(end - start).toBeGreaterThan(0);
  expect(end - start).toBeLessThan(150);
  await expect(page.locator(".experience")).toHaveAttribute(
    "data-chapter",
    "skills",
  );
});
