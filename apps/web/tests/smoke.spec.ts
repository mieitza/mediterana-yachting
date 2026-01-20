import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("homepage loads correctly", async ({ page }) => {
    await page.goto("/");

    // Check title
    await expect(page).toHaveTitle(/Mediterana Yachting/);

    // Check hero section exists
    await expect(page.locator("h1")).toContainText("Experience the Mediterranean");

    // Check navigation links
    await expect(page.getByRole("link", { name: "Yachts" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Destinations" })).toBeVisible();
    await expect(page.getByRole("link", { name: "About" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Blog" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact" })).toBeVisible();
  });

  test("yachts page loads and shows fleet", async ({ page }) => {
    await page.goto("/yachts");

    await expect(page).toHaveTitle(/Our Yachts/);
    await expect(page.locator("h1")).toContainText("Our Fleet");

    // Should have yacht cards
    const yachtCards = page.locator('[href^="/yachts/"]').filter({ hasText: "View" }).or(
      page.locator('article').filter({ has: page.getByRole('heading') })
    );
    await expect(yachtCards.first()).toBeVisible();
  });

  test("yacht detail page loads", async ({ page }) => {
    await page.goto("/yachts/azure-dream");

    // Check yacht name appears
    await expect(page.locator("h1")).toContainText("Azure Dream");

    // Check specs section
    await expect(page.getByText("Length")).toBeVisible();
    await expect(page.getByText("Guests")).toBeVisible();
    await expect(page.getByText("Cabins")).toBeVisible();
  });

  test("destinations page loads", async ({ page }) => {
    await page.goto("/destinations");

    await expect(page).toHaveTitle(/Destinations/);
    await expect(page.locator("h1")).toContainText("Destinations");
  });

  test("destination detail page loads", async ({ page }) => {
    await page.goto("/destinations/greek-islands");

    await expect(page.locator("h1")).toContainText("Greek Islands");
    await expect(page.getByText("Best time")).toBeVisible();
  });

  test("blog page loads", async ({ page }) => {
    await page.goto("/blog");

    await expect(page).toHaveTitle(/Blog/);
    await expect(page.locator("h1")).toContainText("Journal");
  });

  test("blog post page loads", async ({ page }) => {
    await page.goto("/blog/ultimate-guide-mediterranean-yacht-chartering");

    await expect(page.locator("h1")).toContainText("Ultimate Guide");
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");

    await expect(page).toHaveTitle(/About/);
    await expect(page.locator("h1")).toContainText("About Mediterana");
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");

    await expect(page).toHaveTitle(/Contact/);
    await expect(page.locator("h1")).toContainText("Get in Touch");

    // Check form fields exist
    await expect(page.getByLabel(/Name/)).toBeVisible();
    await expect(page.getByLabel(/Email/)).toBeVisible();
    await expect(page.getByLabel(/Message/)).toBeVisible();
  });

  test("inquiry form validation works", async ({ page }) => {
    await page.goto("/contact");

    // Try to submit empty form
    await page.getByRole("button", { name: /Send/i }).click();

    // Should show validation errors
    await expect(page.getByText(/at least 2 characters/i).or(page.getByText(/required/i))).toBeVisible();
  });

  test("navigation works", async ({ page }) => {
    await page.goto("/");

    // Click on Yachts link
    await page.getByRole("link", { name: "Yachts" }).first().click();
    await expect(page).toHaveURL(/\/yachts/);

    // Navigate to About
    await page.getByRole("link", { name: "About" }).first().click();
    await expect(page).toHaveURL(/\/about/);

    // Navigate to Contact via CTA
    await page.getByRole("link", { name: /Get in Touch/i }).or(
      page.getByRole("link", { name: /Contact/i })
    ).first().click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test("404 page works", async ({ page }) => {
    await page.goto("/nonexistent-page");

    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByText(/Page Not Found/i)).toBeVisible();
  });

  test("mobile menu works", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Menu should be hidden initially on mobile
    const mobileMenuButton = page.getByRole("button", { name: /Toggle menu/i });
    await expect(mobileMenuButton).toBeVisible();

    // Open menu
    await mobileMenuButton.click();

    // Check navigation links are visible
    await expect(page.getByRole("link", { name: "Yachts" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Destinations" })).toBeVisible();
  });

  test("yacht filters work", async ({ page }) => {
    await page.goto("/yachts");

    // Apply type filter
    await page.getByRole("combobox").first().click();
    await page.getByRole("option", { name: /Motor/i }).click();

    // URL should update
    await expect(page).toHaveURL(/type=motor/);
  });
});

test.describe("Performance", () => {
  test("homepage loads within acceptable time", async ({ page }) => {
    const start = Date.now();
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const loadTime = Date.now() - start;

    // Should load within 5 seconds (generous for CI)
    expect(loadTime).toBeLessThan(5000);
  });

  test("images are optimized", async ({ page }) => {
    await page.goto("/");

    // Check that images use next/image (have srcset)
    const images = page.locator("img[srcset]");
    const count = await images.count();

    // Should have optimized images
    expect(count).toBeGreaterThan(0);
  });
});
