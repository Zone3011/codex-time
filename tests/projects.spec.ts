import { test, expect } from "@playwright/test";

async function webStarted(page: import("@playwright/test").Page) {
  await page.waitForFunction(
    () =>
      window.SwarmIntro?.activeRoot === document.querySelector(".project-grid"),
  );
  await expect(page.locator("#sw-root .sw-cv")).toHaveCount(1);
}
async function restored(page: import("@playwright/test").Page) {
  await expect(page.locator("#sw-root .sw-cv")).toHaveCount(0, {
    timeout: 15000,
  });
  expect(
    await page.locator(".project-card").evaluateAll((cards) =>
      cards.every((card) => {
        const style = (card as HTMLElement).style;
        return (
          !style.transform &&
          !style.transformOrigin &&
          !style.willChange &&
          !style.transition &&
          !style.visibility
        );
      }),
    ),
  ).toBe(true);
  expect(
    await page.evaluate(() => document.documentElement.style.overflowX),
  ).toBe("");
}

test("three supplied projects arrive with the actual web mode and restore cleanly", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#projects");
  await expect(page.locator(".project-card")).toHaveCount(3);
  await webStarted(page);
  await page.waitForTimeout(230); // Inspect the pull-in phase, not only the initial empty frame.
  await page.screenshot({ path: "test-results/projects-web-intro.png" });
  await expect(page.locator(".project-grid")).toHaveAttribute(
    "data-web-state",
    "complete",
    { timeout: 15000 },
  );
  await restored(page);
  for (const title of ["20 Ways to See the Same Thing", "Creaup", "Sterling"]) {
    await expect(
      page
        .locator("#projects")
        .getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
  }
  await page
    .locator("#projects")
    .screenshot({ path: "test-results/projects-desktop.png" });
  expect(errors).toEqual([]);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  expect(
    await page.evaluate(
      () =>
        window.SwarmIntro?.activeRoot ===
        document.querySelector(".project-grid"),
    ),
  ).toBe(false);
});

test("live reduced motion stops a project reveal and restores the cards", async ({
  page,
}) => {
  await page.goto("/#projects");
  await webStarted(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await restored(page);
  await expect(
    page.locator("#projects").getByRole("heading", { name: "Creaup" }),
  ).toBeVisible();
});

test("native scrolling cancels a running web reveal without locking the page", async ({
  page,
}) => {
  await page.goto("/#projects");
  await webStarted(page);
  const before = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => window.scrollBy(0, -120));
  await restored(page);
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(before);
});

test("mobile cards each reveal when encountered", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#projects");
  const cards = page.locator(".project-card");
  for (let index = 0; index < 3; index++) {
    await cards.nth(index).scrollIntoViewIfNeeded();
    await expect(cards.nth(index)).toHaveAttribute(
      "data-web-revealed",
      "true",
      { timeout: 20000 },
    );
  }
  await restored(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .locator("#projects")
    .screenshot({ path: "test-results/projects-mobile.png" });
});

test("project content works with JavaScript disabled at 320px", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 740 },
  });
  const page = await context.newPage();
  await page.goto("/#projects");
  await expect(page.locator(".project-card")).toHaveCount(3);
  await expect(
    page
      .locator("#projects")
      .getByRole("heading", { name: "20 Ways to See the Same Thing" }),
  ).toBeVisible();
  await expect(
    page
      .locator("#projects")
      .getByRole("heading", { name: "Sterling", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});
