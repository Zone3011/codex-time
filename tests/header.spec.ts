import { test, expect, type Page } from "@playwright/test";

async function started(page: Page) {
  await page.waitForFunction(() => window.SwarmIntro?.running === true);
  await expect(page.locator(".sw-cur").first()).toBeVisible();
}
async function clean(page: Page) {
  await page.waitForFunction(() => window.SwarmIntro?.running === false, {
    timeout: 25000,
  });
  await expect(
    page.locator(
      ".sw-cur,.sw-sel,.sw-caret,.sw-badge,.sw-w,.sw-hide-box,.sw-hide-media",
    ),
  ).toHaveCount(0);
}

test("supplied swarm draws selections, types text, and cleans up", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await started(page);
  await expect(page.locator(".sw-w").first()).toBeAttached();
  await expect(page.locator(".sw-sel").first()).toBeVisible({ timeout: 10000 });
  await page.waitForFunction(
    () =>
      Array.from(document.querySelectorAll<HTMLElement>(".sw-w span")).filter(
        (el) => el.style.visibility === "visible",
      ).length >= 5,
  );
  await page.screenshot({ path: "test-results/swarm-in-progress.png" });
  await clean(page);
  await expect(
    page.getByRole("heading", { name: "Nirav Patel" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Let’s talk/ })).toHaveAttribute(
    "href",
    "mailto:niravpatel1422004@gmail.com",
  );
  expect(errors).toEqual([]);
});

test("pause restores content and resume starts the supplied engine", async ({
  page,
}) => {
  await page.goto("/");
  await started(page);
  await page.getByRole("button", { name: "Pause motion" }).click();
  await clean(page);
  await expect(
    page.getByRole("button", { name: "Replay swarm animation" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Resume motion" }).click();
  await started(page);
  await page.keyboard.press("Escape");
  await clean(page);
});

test("reduced motion and mobile keep content visible without overflow", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.waitForFunction(() => !!window.SwarmIntro);
  expect(await page.evaluate(() => window.SwarmIntro?.running)).toBe(false);
  await expect(
    page.getByRole("link", { name: "Nirav Patel home" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("header remains usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Let’s talk/ })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Nirav Patel" }),
  ).toBeVisible();
  await context.close();
});

test("live reduced motion cancels the running supplied engine", async ({
  page,
}) => {
  await page.goto("/");
  await started(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await clean(page);
});

test("desktop and mobile screenshots after the actual swarm finishes", async ({
  page,
}) => {
  await page.goto("/");
  await started(page);
  await clean(page);
  await page.screenshot({ path: "test-results/header-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/header-mobile.png" });
});

test("replay runs again and Escape restores all wrapped text", async ({
  page,
}) => {
  await page.goto("/");
  await started(page);
  await page.keyboard.press("Escape");
  await clean(page);
  await page.getByRole("button", { name: "Replay swarm animation" }).click();
  await started(page);
  await page.keyboard.press("Escape");
  await clean(page);
  await page.getByRole("link", { name: /Let’s talk/ }).focus();
  await expect(page.getByRole("link", { name: /Let’s talk/ })).toBeFocused();
});

test("opening fits a narrow phone after swarm cleanup", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  await started(page);
  await page.keyboard.press("Escape");
  await clean(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("contact opens during swarm, copies email, and closes with keyboard", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await started(page);
  const link = page.getByRole("link", { name: /talk/ });
  await link.click();
  const dialog = page.getByRole("dialog", { name: /talk/ });
  await expect(dialog).toBeVisible();
  await page.screenshot({ path: "test-results/contact-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/contact-mobile.png" });
  await clean(page);
  await expect(
    dialog.getByRole("link", { name: "Open email app" }),
  ).toHaveAttribute("href", "mailto:niravpatel1422004@gmail.com");
  await dialog.getByRole("button", { name: "Copy email" }).click();
  await expect(dialog.getByRole("status")).toHaveText("Email copied.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "niravpatel1422004@gmail.com",
  );
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(link).toBeFocused();
  await link.click();
  await dialog.getByRole("button", { name: "Close contact" }).click();
  await expect(dialog).not.toBeVisible();
});

test("successive refreshes choose different origins and build orders", async ({
  page,
}) => {
  await page.goto("/");
  await started(page);
  let previous = await page.evaluate(() => ({
    saved: JSON.parse(sessionStorage.getItem("nirav-intro-plan")!),
    actual: window.SwarmIntro?.lastPlan,
  }));
  for (let refresh = 0; refresh < 3; refresh++) {
    await page.reload();
    await started(page);
    const current = await page.evaluate(() => ({
      saved: JSON.parse(sessionStorage.getItem("nirav-intro-plan")!),
      actual: window.SwarmIntro?.lastPlan,
    }));
    expect(current.saved.origin).not.toBe(previous.saved.origin);
    expect(current.saved.order).not.toBe(previous.saved.order);
    expect(current.actual?.start).not.toBe(previous.actual?.start);
    previous = current;
  }
});
