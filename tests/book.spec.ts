import { test, expect } from "@playwright/test";

test("desktop pairs each company's experience with a three-photo gallery", async ({
  page,
}) => {
  await page.goto("/#experience");
  await page.getByRole("button", { name: "Pause auto-turn" }).click();
  const sedani = page.getByRole("tabpanel", { name: "Sedani Digital" });
  await expect(
    sedani.getByRole("heading", { name: "Intern Software Developer" }),
  ).toBeVisible();
  await expect(
    sedani.getByRole("img", { name: /photo placeholder/ }),
  ).toHaveCount(3);
  await page
    .locator(".experience-section")
    .screenshot({ path: "test-results/book-desktop-sedani.png" });
  await page.getByRole("tab", { name: "hfiles" }).click();
  await expect(page.locator(".turn-front")).toHaveCount(1);
  await expect(page.locator(".turn-back")).toHaveCount(1);
  await page.locator(".turn-leaf").evaluate((element) =>
    element.getAnimations({ subtree: true }).forEach((animation) => {
      animation.pause();
      animation.currentTime = 360;
    }),
  );
  await page
    .locator(".book-cover")
    .screenshot({ path: "test-results/book-mid-turn.png" });
  await page
    .locator(".turn-leaf")
    .evaluate((element) =>
      element
        .getAnimations({ subtree: true })
        .forEach((animation) => animation.play()),
    );
  await expect(page.locator(".turn-leaf,.turn-hold")).toHaveCount(0);
  const hfiles = page.getByRole("tabpanel", { name: "hfiles" });
  await expect(
    hfiles.getByRole("heading", { name: "Web Developer", exact: true }),
  ).toBeVisible();
  await expect(
    hfiles.getByRole("img", { name: /photo placeholder/ }),
  ).toHaveCount(3);
  await page
    .locator(".book-desk")
    .screenshot({ path: "test-results/book-desktop-hfiles.png" });
});

test("mobile navigates four pages and cleans up interrupted paper turns", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#experience");
  const sedani = page.getByRole("tab", { name: "Sedani Digital" });
  const hfiles = page.getByRole("tab", { name: "hfiles" });
  await expect(
    page.getByRole("button", { name: "Previous page" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(
    page.getByRole("region", { name: /Sedani Digital.*Gallery/ }),
  ).toBeVisible();
  await expect(sedani).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".turn-leaf")).toHaveCount(0);
  await page
    .locator(".book-desk")
    .screenshot({ path: "test-results/book-mobile-gallery.png" });
  await sedani.focus();
  await page.keyboard.press("ArrowRight");
  await expect(hfiles).toBeFocused();
  await expect(
    page.getByRole("region", { name: /hfiles.*Experience/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(
    page.getByRole("region", { name: /hfiles.*Gallery/ }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Next page" })).toBeDisabled();
  await hfiles.focus();
  await page.keyboard.press("Home");
  await hfiles.click();
  await sedani.click();
  await expect(page.locator(".turn-leaf,.turn-hold")).toHaveCount(0);
  await expect(
    page.getByRole("region", { name: /Sedani Digital.*Experience/ }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await page.evaluate(() => {
      const ids = Array.from(
        document.querySelectorAll("[id]"),
        (element) => element.id,
      );
      return ids.length === new Set(ids).size;
    }),
  ).toBe(true);
});

test("book respects the shared pause setting and live reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Pause motion" }).click();
  await page.getByRole("tab", { name: "hfiles" }).click();
  await expect(
    page.getByRole("region", { name: /hfiles.*Experience/ }),
  ).toBeVisible();
  await expect(page.locator(".turn-leaf")).toHaveCount(0);
  await expect(page.locator(".memory-reader")).toHaveAttribute(
    "data-auto-running",
    "false",
  );
  await page.getByRole("button", { name: "Resume motion" }).click();
  await page.getByRole("tab", { name: "Sedani Digital" }).click();
  await expect(page.locator(".turn-leaf")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".turn-leaf,.turn-hold")).toHaveCount(0);
  await page.getByRole("tab", { name: "hfiles" }).click();
  await expect(
    page.getByRole("region", { name: /hfiles.*Experience/ }),
  ).toBeVisible();
  await expect(page.locator(".turn-leaf")).toHaveCount(0);
});

test("four pages and six gallery slots remain readable without JavaScript", async ({
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
  await expect(
    page.getByRole("img", { name: /photo placeholder/ }),
  ).toHaveCount(6);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});

test("automatic spreads turn at five seconds, loop, and can be paused", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-10T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-11-10T00:00:01Z"));
  await page.goto("/#experience");
  await expect(page.locator(".memory-reader")).toHaveAttribute(
    "data-auto-running",
    "true",
  );
  const sedani = page.getByRole("tab", { name: "Sedani Digital" });
  const hfiles = page.getByRole("tab", { name: "hfiles" });
  await page.clock.runFor(4999);
  await expect(sedani).toHaveAttribute("aria-selected", "true");
  await page.clock.runFor(1);
  await expect(hfiles).toHaveAttribute("aria-selected", "true");
  await page.clock.runFor(5000);
  await expect(sedani).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Pause auto-turn" }).click();
  await page.clock.runFor(10000);
  await expect(sedani).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("button", { name: "Resume auto-turn" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("automatic turns stop outside the book and under reduced motion", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-10T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-11-10T00:00:01Z"));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#experience");
  await expect(page.locator(".memory-reader")).toHaveAttribute(
    "data-auto-running",
    "false",
  );
  await page.clock.runFor(12000);
  await expect(
    page.getByRole("tab", { name: "Sedani Digital" }),
  ).toHaveAttribute("aria-selected", "true");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.runFor(10000);
  await expect(page.locator(".memory-reader")).toHaveAttribute(
    "data-auto-running",
    "false",
  );
  await expect(
    page.getByRole("tab", { name: "Sedani Digital" }),
  ).toHaveAttribute("aria-selected", "true");
});

test("auto-turn pauses while reading and restarts its five-second countdown", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-10T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-11-10T00:00:01Z"));
  await page.goto("/#experience");
  const reader = page.locator(".memory-reader");
  await expect(reader).toHaveAttribute("data-auto-running", "true");
  await page.locator(".book-cover").hover();
  await expect(reader).toHaveAttribute("data-auto-running", "false");
  await page.clock.runFor(8000);
  await expect(
    page.getByRole("tab", { name: "Sedani Digital" }),
  ).toHaveAttribute("aria-selected", "true");
  await page.mouse.move(0, 0);
  await expect(reader).toHaveAttribute("data-auto-running", "true");
  await page.clock.runFor(4999);
  await expect(
    page.getByRole("tab", { name: "Sedani Digital" }),
  ).toHaveAttribute("aria-selected", "true");
  await page.clock.runFor(1);
  await expect(page.getByRole("tab", { name: "hfiles" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
