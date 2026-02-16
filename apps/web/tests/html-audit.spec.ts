import { test, expect } from "@playwright/test";

/**
 * Crawl the entire public site and detect unescaped HTML tags
 * rendered as visible text (e.g. "<p>text</p>" showing literally).
 */

const HTML_TAG_PATTERN = /<\/?(?:p|div|span|h[1-6]|ul|ol|li|br|strong|em|a|b|i|blockquote|pre|code|img|table|tr|td|th|thead|tbody|hr|section|article|header|footer|nav|main|aside|figure|figcaption|mark|small|sub|sup|del|ins)\b[^>]*>/i;

interface Finding {
  page: string;
  selector: string;
  text: string;
  tag: string;
}

async function auditPage(page: any, url: string, findings: Finding[]) {
  try {
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    if (!response || response.status() >= 400) {
      console.log(`  SKIP ${url} (status ${response?.status()})`);
      return;
    }
  } catch (e: any) {
    console.log(`  SKIP ${url} (${e.message})`);
    return;
  }

  // Wait for content to render
  await page.waitForTimeout(1000);

  // Get all visible text nodes and check for HTML tags
  const results = await page.evaluate((pattern: string) => {
    const regex = new RegExp(pattern, "i");
    const found: { selector: string; text: string; tag: string }[] = [];

    // Get all elements that contain text
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node: Node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          // Skip script, style, noscript, textarea, code, pre elements
          const skipTags = ["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "PRE"];
          if (skipTags.includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
          // Skip hidden elements
          const style = window.getComputedStyle(parent);
          if (style.display === "none" || style.visibility === "hidden") return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    let node: Node | null;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim() || "";
      if (text.length > 0 && regex.test(text)) {
        const parent = node.parentElement!;
        // Build a useful selector
        let selector = parent.tagName.toLowerCase();
        if (parent.id) selector += `#${parent.id}`;
        if (parent.className && typeof parent.className === "string") {
          selector += "." + parent.className.split(/\s+/).slice(0, 2).join(".");
        }

        // Extract the matched tag
        const match = text.match(new RegExp(pattern, "i"));

        found.push({
          selector,
          text: text.length > 200 ? text.substring(0, 200) + "..." : text,
          tag: match ? match[0] : "unknown",
        });
      }
    }

    return found;
  }, HTML_TAG_PATTERN.source);

  for (const result of results) {
    findings.push({
      page: url,
      ...result,
    });
  }

  if (results.length > 0) {
    console.log(`  FOUND ${results.length} issue(s) on ${url}`);
    for (const r of results) {
      console.log(`    [${r.selector}] ${r.tag} in: "${r.text.substring(0, 100)}..."`);
    }
  } else {
    console.log(`  OK ${url}`);
  }
}

test.describe("HTML Escape Audit", () => {
  test("scan all public pages for unescaped HTML in visible text", async ({ page }) => {
    test.setTimeout(300000);

    const baseURL = "https://www.mediteranayachting.com";
    const findings: Finding[] = [];

    // Static pages
    const staticPages = [
      "/",
      "/yachts",
      "/destinations",
      "/blog",
      "/about",
      "/contact",
      "/privacy",
      "/terms",
    ];

    console.log("\n=== Scanning static pages ===");
    for (const path of staticPages) {
      await auditPage(page, baseURL + path, findings);
    }

    // Discover dynamic pages by extracting links
    console.log("\n=== Discovering dynamic pages ===");

    // Yacht detail pages
    await page.goto(baseURL + "/yachts", { waitUntil: "domcontentloaded" });
    const yachtLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href^="/yachts/"]'))
        .map((a) => (a as HTMLAnchorElement).getAttribute("href"))
        .filter((href): href is string => !!href && href !== "/yachts" && !href.includes("?"))
        .filter((v, i, arr) => arr.indexOf(v) === i);
    });

    console.log(`  Found ${yachtLinks.length} yacht pages`);
    for (const link of yachtLinks) {
      await auditPage(page, baseURL + link, findings);
    }

    // Destination detail pages
    await page.goto(baseURL + "/destinations", { waitUntil: "domcontentloaded" });
    const destLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href^="/destinations/"]'))
        .map((a) => (a as HTMLAnchorElement).getAttribute("href"))
        .filter((href): href is string => !!href && href !== "/destinations" && !href.includes("?"))
        .filter((v, i, arr) => arr.indexOf(v) === i);
    });

    console.log(`  Found ${destLinks.length} destination pages`);
    for (const link of destLinks) {
      await auditPage(page, baseURL + link, findings);
    }

    // Blog post pages
    await page.goto(baseURL + "/blog", { waitUntil: "domcontentloaded" });
    const blogLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href^="/blog/"]'))
        .map((a) => (a as HTMLAnchorElement).getAttribute("href"))
        .filter((href): href is string => !!href && href !== "/blog" && !href.includes("?"))
        .filter((v, i, arr) => arr.indexOf(v) === i);
    });

    console.log(`  Found ${blogLinks.length} blog post pages`);
    for (const link of blogLinks) {
      await auditPage(page, baseURL + link, findings);
    }

    // Report
    console.log("\n=== AUDIT REPORT ===");
    if (findings.length === 0) {
      console.log("No unescaped HTML found! All pages are clean.");
    } else {
      console.log(`Found ${findings.length} instance(s) of unescaped HTML:\n`);
      for (const f of findings) {
        console.log(`PAGE: ${f.page}`);
        console.log(`  ELEMENT: ${f.selector}`);
        console.log(`  TAG: ${f.tag}`);
        console.log(`  TEXT: ${f.text}`);
        console.log("");
      }
    }

    // Fail the test if we found issues
    expect(findings, `Found ${findings.length} unescaped HTML issue(s)`).toHaveLength(0);
  });
});
