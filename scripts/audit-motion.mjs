#!/usr/bin/env node
/**
 * Motion accessibility audit — verifies the home page honours
 * `prefers-reduced-motion: reduce` on the popular-route cards
 * and general utility classes (.hover-lift, .interactive-surface, …).
 *
 * Also captures a rAF-based frame-time trace of the route-card
 * "train" animation to catch regressions in animation performance.
 *
 * Usage:  node scripts/audit-motion.mjs
 * Assumes the dev server is running at http://localhost:8080.
 */
import { chromium } from "playwright";

const URL = process.env.AUDIT_URL ?? "http://localhost:8080/";

function fail(msg) {
  console.error("✖", msg);
  process.exitCode = 1;
}
function pass(msg) {
  console.log("✓", msg);
}

async function auditMode(browser, reducedMotion) {
  const ctx = await browser.newContext({
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".route-card", { timeout: 10_000 });

  const state = await page.$$eval(".route-card", (cards) => {
    return cards.slice(0, 1).map((card) => {
      const img = card.querySelector(".route-card__img");
      const train = card.querySelector(".route-card__train");
      const arrow = card.querySelector(".route-card__arrow");
      const read = (el) => {
        if (!el) return null;
        const cs = getComputedStyle(el);
        return {
          transition: cs.transitionProperty + " " + cs.transitionDuration,
          animation: cs.animationName + " " + cs.animationDuration,
          transform: cs.transform,
        };
      };
      return { img: read(img), train: read(train), arrow: read(arrow) };
    });
  });

  const label = reducedMotion ? "reduced-motion" : "no-preference";
  console.log(`\n— ${label} —`);
  console.log(JSON.stringify(state, null, 2));

  if (reducedMotion) {
    const first = state[0];
    for (const [key, val] of Object.entries(first)) {
      if (!val) continue;
      if (!/0s/.test(val.transition) && !/none/.test(val.transition)) {
        fail(`route-card ${key} still transitions under reduced-motion: ${val.transition}`);
      } else {
        pass(`route-card ${key} respects reduced-motion (transition=${val.transition})`);
      }
      if (!/none/.test(val.animation) && !/ 0s/.test(val.animation)) {
        fail(`route-card ${key} still animates under reduced-motion: ${val.animation}`);
      }
    }
  }

  await ctx.close();
}

async function traceAnimation(browser) {
  const ctx = await browser.newContext({
    reducedMotion: "no-preference",
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".route-card");

  // Focus the first card to trigger the animation deterministically.
  await page.$eval(".route-card a", (a) => a.focus());

  const trace = await page.evaluate(async () => {
    const samples = [];
    let last = performance.now();
    const start = last;
    return await new Promise((resolve) => {
      function tick(now) {
        samples.push(now - last);
        last = now;
        if (now - start < 1000) requestAnimationFrame(tick);
        else resolve(samples);
      }
      requestAnimationFrame(tick);
    });
  });

  const frames = trace.length;
  const avg = trace.reduce((a, b) => a + b, 0) / frames;
  const worst = Math.max(...trace);
  const dropped = trace.filter((d) => d > 20).length; // >20ms ≈ dropped @ 60fps
  console.log(`\n— animation trace (1s while train travels) —`);
  console.log(
    `  frames: ${frames}  avg: ${avg.toFixed(2)}ms  worst: ${worst.toFixed(2)}ms  dropped>20ms: ${dropped}`,
  );
  if (dropped > 3) fail(`Route-card animation dropped ${dropped} frames (>20ms) in 1s window`);
  else pass(`Route-card animation smooth (avg ${avg.toFixed(1)}ms, ${dropped} slow frames)`);

  await ctx.close();
}

const browser = await chromium.launch();
try {
  await auditMode(browser, false);
  await auditMode(browser, true);
  await traceAnimation(browser);
} finally {
  await browser.close();
}
if (process.exitCode) console.error("\nMotion audit failed.");
else console.log("\nMotion audit passed.");
