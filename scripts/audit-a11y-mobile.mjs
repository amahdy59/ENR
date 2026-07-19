#!/usr/bin/env node
/**
 * Playwright + axe-core accessibility audit for the mobile viewport.
 *
 * Targets:
 *   1. Home page (/) — includes the planner form and mobile tab bar.
 *   2. Search results page (/search?...) — mobile train cards + sticky header.
 *   3. Filter bottom sheets on the search page (Modify / Time / Type / Price).
 *
 * Fails on any WCAG 2 A/AA violation. Runs headless Chromium at 390×844
 * (iPhone 13 baseline). Requires the dev server running at $AUDIT_URL
 * (defaults to http://localhost:8080). Used by CI on every PR.
 */
import { chromium, devices } from "playwright";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const BASE = process.env.AUDIT_URL ?? "http://localhost:8080";
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

let failed = 0;
const summary = [];

function log(ok, label, detail = "") {
  const mark = ok ? "✓" : "✖";
  console.log(`${mark} ${label}${detail ? "  " + detail : ""}`);
  if (!ok) failed++;
  summary.push({ ok, label, detail });
}

async function runAxe(page, context) {
  await page.addScriptTag({ content: axeSource });
  const result = await page.evaluate(async (tags) => {
    return await axe.run(document, {
      runOnly: { type: "tag", values: tags },
      resultTypes: ["violations"],
    });
  }, WCAG_TAGS);

  const violations = result.violations ?? [];
  if (violations.length === 0) {
    log(true, `${context}: 0 WCAG A/AA violations`);
    return;
  }
  log(false, `${context}: ${violations.length} violation(s)`);
  for (const v of violations) {
    console.error(`   • [${v.impact}] ${v.id} — ${v.help}`);
    console.error(`     ${v.helpUrl}`);
    for (const node of v.nodes.slice(0, 3)) {
      console.error(`     ↳ ${node.target.join(" ")}`);
    }
  }
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices["iPhone 13"],
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  // --- Home page ---
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("main");
  await runAxe(page, "Home (mobile)");

  // --- Search results ---
  const searchUrl = `${BASE}/search?from=CAI&to=ALY&date=2026-08-15&passengers=1&way=one-way`;
  await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("main");
  // Let async trip results resolve (findTrips is lazy-imported).
  await page.waitForTimeout(1500);
  await runAxe(page, "Search results (mobile)");

  // --- Filter bottom sheets ---
  const filters = [
    { label: "Modify search", selector: 'button:has-text("Modify")' },
    { label: "Time filter sheet", selector: 'button:has-text("Time")' },
    { label: "Type filter sheet", selector: 'button:has-text("Type")' },
    { label: "Price filter sheet", selector: 'button:has-text("Price")' },
  ];
  for (const f of filters) {
    const trigger = page.locator(f.selector).first();
    if ((await trigger.count()) === 0) {
      log(false, `${f.label}: trigger not found (${f.selector})`);
      continue;
    }
    await trigger.click();
    // Radix Dialog / Sheet content
    await page.waitForSelector('[role="dialog"]', { timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(300);
    await runAxe(page, f.label);
    // Close sheet: press Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
  }

  await browser.close();
}

try {
  await main();
} catch (err) {
  console.error("Audit crashed:", err);
  process.exit(2);
}

console.log(`\nMobile a11y audit: ${summary.filter((s) => s.ok).length} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
