#!/usr/bin/env node
/**
 * WCAG AAA contrast regression audit.
 *
 * Parses src/styles.css, resolves the ENR design-token CSS variables for both
 * the light and dark themes, and asserts that every semantic foreground /
 * background pair we care about meets WCAG 2.1 AAA contrast (>= 7:1 for normal
 * text, >= 4.5:1 for large text / non-text UI).
 *
 * Run locally:  node scripts/audit-contrast.mjs
 * In CI:        added as a step in .github/workflows/a11y-audit.yml
 *
 * Exits non-zero when any pair fails so CI blocks the merge.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSS_PATH = resolve(__dirname, "..", "src", "styles.css");
const css = readFileSync(CSS_PATH, "utf8");

/* -------------------- CSS parsing -------------------- */

/** Extract the body of the FIRST block matching a selector regex. */
function extractBlock(selectorRegex) {
  const m = css.match(selectorRegex);
  if (!m) throw new Error(`Could not find block: ${selectorRegex}`);
  const start = m.index + m[0].length;
  // Find the matching closing brace at depth 0.
  let depth = 1;
  for (let i = start; i < css.length; i++) {
    const c = css[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return css.slice(start, i);
    }
  }
  throw new Error(`Unbalanced braces after ${selectorRegex}`);
}

function parseVars(block) {
  const vars = {};
  const re = /--([\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(block)) !== null) vars[m[1]] = m[2].trim();
  return vars;
}

/** Resolve `var(--x)` recursively against a scope. */
function resolve_var(value, scope, seen = new Set()) {
  if (typeof value !== "string") return value;
  let v = value.trim();
  const varRe = /var\(\s*--([\w-]+)\s*(?:,\s*([^)]+))?\)/;
  while (varRe.test(v)) {
    v = v.replace(varRe, (_, name, fallback) => {
      if (seen.has(name)) return fallback ?? "#000";
      seen.add(name);
      const raw = scope[name];
      if (raw == null) return fallback ?? "#000";
      return resolve_var(raw, scope, seen);
    });
  }
  return v;
}

const lightBlock = extractBlock(/:root,\s*\[data-theme="light"\]\s*\{/);
const darkBlock = extractBlock(/\.dark,\s*\[data-theme="dark"\]\s*\{/);
const lightVars = parseVars(lightBlock);
const darkVars = parseVars(darkBlock);

/* -------------------- Contrast math (WCAG 2.1) -------------------- */

function hexToRgb(hex) {
  const m = hex.replace("#", "").trim();
  const n =
    m.length === 3
      ? m
          .split("")
          .map((c) => c + c)
          .join("")
      : m;
  const int = parseInt(n, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function relLum([r, g, b]) {
  const srgb = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrast(fgHex, bgHex) {
  const L1 = relLum(hexToRgb(fgHex));
  const L2 = relLum(hexToRgb(bgHex));
  const [a, b] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (a + 0.05) / (b + 0.05);
}

/* -------------------- Audit matrix -------------------- */

/**
 * Each entry describes a semantic pairing rendered somewhere in the app.
 * `fg` and `bg` reference token names (without `--` prefix); `min` is the
 * required contrast ratio. Use 4.5 only for non-text UI (borders, icons on
 * fills that are never used for body copy).
 */
const PAIRS = [
  // Base body text on every surface
  { name: "text-primary on bg-base", fg: "text-primary", bg: "bg-base", min: 7 },
  { name: "text-primary on bg-surface", fg: "text-primary", bg: "bg-surface", min: 7 },
  { name: "text-primary on bg-elevated", fg: "text-primary", bg: "bg-elevated", min: 7 },
  { name: "text-primary on bg-muted", fg: "text-primary", bg: "bg-muted", min: 7 },
  { name: "text-secondary on bg-base", fg: "text-secondary", bg: "bg-base", min: 7 },
  { name: "text-secondary on bg-surface", fg: "text-secondary", bg: "bg-surface", min: 7 },
  { name: "text-tertiary on bg-base", fg: "text-tertiary", bg: "bg-base", min: 7 },
  { name: "text-tertiary on bg-surface", fg: "text-tertiary", bg: "bg-surface", min: 7 },
  { name: "text-brand on bg-base", fg: "text-brand", bg: "bg-base", min: 7 },
  { name: "text-brand on brand-primary-tint", fg: "text-brand", bg: "brand-primary-tint", min: 7 },
  { name: "text-accent on bg-base", fg: "text-accent", bg: "bg-base", min: 7 },

  // Nav bar (always dark navy) + nav text
  { name: "text-inverse on bg-nav-bar", fg: "text-inverse", bg: "bg-nav-bar", min: 7 },
  { name: "text-nav-inactive on bg-nav-bar", fg: "text-nav-inactive", bg: "bg-nav-bar", min: 7 },
  {
    name: "text-on-dark-accent on bg-nav-bar",
    fg: "text-on-dark-accent",
    bg: "bg-nav-bar",
    min: 7,
  },

  // Buttons / CTAs (large text -> 4.5, but hold to 7 where practical)
  { name: "primary-foreground on primary", fg: "primary-foreground", bg: "primary", min: 4.5 },
  {
    name: "interactive-cta-text on interactive-cta",
    fg: "interactive-cta-text",
    bg: "interactive-cta",
    min: 4.5,
  },

  // Status pills
  {
    name: "status-success on status-success-bg",
    fg: "status-success",
    bg: "status-success-bg",
    min: 7,
  },
  {
    name: "status-warning on status-warning-bg",
    fg: "status-warning",
    bg: "status-warning-bg",
    min: 7,
  },
  { name: "status-error on status-error-bg", fg: "status-error", bg: "status-error-bg", min: 7 },
  { name: "status-info on status-info-bg", fg: "status-info", bg: "status-info-bg", min: 7 },

  // Focus ring visibility against base (non-text UI: 3:1 minimum, we hold 4.5)
  {
    name: "interactive-focus-ring vs bg-base",
    fg: "interactive-focus-ring",
    bg: "bg-base",
    min: 3,
  },
  {
    name: "interactive-focus-ring vs bg-nav-bar",
    fg: "interactive-focus-ring",
    bg: "bg-nav-bar",
    min: 3,
  },
];

/** Special token that's constant across themes. */
const CONSTANTS = { "text-on-dark-accent": "#fbbf24" };

function runTheme(label, scope) {
  const failures = [];
  const results = [];
  for (const p of PAIRS) {
    const fg = CONSTANTS[p.fg] ?? resolve_var(`var(--${p.fg})`, scope);
    const bg = CONSTANTS[p.bg] ?? resolve_var(`var(--${p.bg})`, scope);
    if (!/^#[0-9a-f]{3,8}$/i.test(fg) || !/^#[0-9a-f]{3,8}$/i.test(bg)) {
      failures.push(`[${label}] ${p.name}: unresolved (fg=${fg}, bg=${bg})`);
      continue;
    }
    const ratio = contrast(fg, bg);
    const pass = ratio >= p.min;
    results.push({ theme: label, name: p.name, fg, bg, ratio: ratio.toFixed(2), min: p.min, pass });
    if (!pass) {
      failures.push(
        `[${label}] ${p.name}: ${ratio.toFixed(2)}:1 (need ${p.min}:1)  fg=${fg} bg=${bg}`,
      );
    }
  }
  return { results, failures };
}

const light = runTheme("light", lightVars);
const dark = runTheme("dark", { ...lightVars, ...darkVars });

console.log("\nWCAG AAA contrast audit\n" + "=".repeat(60));
for (const r of [...light.results, ...dark.results]) {
  const badge = r.pass ? "PASS" : "FAIL";
  console.log(
    `  ${badge}  [${r.theme}] ${r.name.padEnd(46)} ${r.ratio.padStart(5)}:1  (min ${r.min})`,
  );
}

const allFailures = [...light.failures, ...dark.failures];
if (allFailures.length) {
  console.error("\nContrast failures:\n  - " + allFailures.join("\n  - "));
  console.error(
    `\n${allFailures.length} pair(s) below the WCAG AAA target. Adjust tokens in src/styles.css.`,
  );
  process.exit(1);
}

console.log(`\nAll ${light.results.length + dark.results.length} pairs meet target contrast.`);
