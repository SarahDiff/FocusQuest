#!/usr/bin/env node
/**
 * Headless accessibility audit using axe-core + Playwright.
 *
 * Prerequisites:
 *   1. Dev server reachable at A11Y_BASE_URL (default http://127.0.0.1:3000)
 *   2. Browsers: `npx playwright install chromium`
 *
 * Run alone (server already up):  node script/a11y-browser.mjs
 * Run with server (see package.json a11y:axe): npm run a11y:axe
 */

import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const BASE = process.env.A11Y_BASE_URL || "http://127.0.0.1:3000";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const STORAGE_KEY = "focusquest_v1";

/** Minimal saved state so main app routes render (not onboarding). */
function completedOnboardingState() {
  const now = Date.now();
  return {
    character: {
      name: "Pathwalker",
      disciplines: ["warrior", "scholar"],
      bearing: "neutral",
    },
    onboardingComplete: true,
    userDisciplines: [
      { disciplineId: "warrior", totalMinutes: 120 },
      { disciplineId: "scholar", totalMinutes: 30 },
    ],
    sessions: [
      {
        id: "a11y-seed",
        skillId: "warrior",
        skillName: "Warrior",
        durationMinutes: 25,
        xpEarned: 25,
        date: new Date().toISOString(),
      },
    ],
    activeSession: {
      skillId: "warrior",
      startTime: now - 90_000,
      pausedAt: null,
      totalPausedMs: 0,
      targetMinutes: 25,
    },
    shieldEnabled: false,
    blocklist: [],
    nudgeEnabled: false,
    minSessionMinutes: 15,
    pendingAvatarUpgrade: false,
  };
}

const ROUTES_ONBOARDING = [{ path: "/", name: "onboarding (splash)" }];

const ROUTES_MAIN = [
  { path: "/", name: "home" },
  { path: "/skills", name: "skills" },
  { path: "/history", name: "history" },
  { path: "/profile", name: "profile" },
  { path: "/profile/edit-character", name: "edit-character" },
  { path: "/session", name: "session (active timer)" },
];

function printViolation(v) {
  console.error(`  • [${v.id}] ${v.help}`);
  console.error(`    Impact: ${v.impact}`);
  console.error(`    ${v.helpUrl}`);
  for (const node of v.nodes?.slice(0, 5) ?? []) {
    const target = Array.isArray(node.target) ? node.target.join(" ") : node.target;
    console.error(`    → ${target}`);
    if (node.failureSummary) console.error(`      ${node.failureSummary}`);
  }
  if ((v.nodes?.length ?? 0) > 5) {
    console.error(`    … and ${v.nodes.length - 5} more nodes`);
  }
}

async function runAxe(page, label) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();

  const violations = results.violations ?? [];
  if (violations.length === 0) {
    console.log(`  ✅ ${label}: 0 violations`);
    return 0;
  }
  console.error(`  ❌ ${label}: ${violations.length} violation(s)`);
  for (const v of violations) printViolation(v);
  return violations.length;
}

async function main() {
  console.log(`FocusQuest — axe + Playwright (base: ${BASE})\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  let total = 0;

  // ── Onboarding (clear storage) ─────────────────────────────
  await context.clearCookies();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    try {
      localStorage.clear();
    } catch {
      /* ignore */
    }
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await delay(800);

  for (const { path, name } of ROUTES_ONBOARDING) {
    const url = `${BASE}${path}`;
    console.log(`→ ${name} (${url})`);
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await delay(500);
    total += await runAxe(page, name);
  }

  // ── Main app (seed localStorage) ───────────────────────────
  const payload = JSON.stringify(completedOnboardingState());
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ([key, data]) => {
      localStorage.setItem(key, data);
    },
    [STORAGE_KEY, payload],
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await delay(800);

  for (const { path, name } of ROUTES_MAIN) {
    const url = `${BASE}${path}`;
    console.log(`→ ${name} (${url})`);
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await delay(600);
    total += await runAxe(page, name);
  }

  await browser.close();

  console.log("");
  if (total > 0) {
    console.error(`Done: ${total} violation(s) total (see above).`);
    process.exit(1);
  }
  console.log("Done: no axe violations on scanned routes.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
