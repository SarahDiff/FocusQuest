#!/usr/bin/env node
/**
 * FocusQuest — WCAG contrast audit for design tokens.
 *
 * Computes contrast for text/accents on common app backgrounds (solid + frosted composites).
 * This matches how most screens look since they reuse --fq-* tokens.
 *
 * WCAG 2.1:
 * - Normal text AA: 4.5:1
 * - Large text AA: 3:1 (≥18pt or ≥14pt bold — we flag “large” pairs separately)
 * - Normal text AAA: 7:1
 * - Large text AAA: 4.5:1
 */

const BASE_BG = "#0f1318";
const DEPTH_BG = "#090c10";

/** sRGB 0–255 */
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbaBlendOver(r, g, b, a, bgHex) {
  const bg = hexToRgb(bgHex);
  return {
    r: Math.round(r * a + bg.r * (1 - a)),
    g: Math.round(g * a + bg.g * (1 - a)),
    b: Math.round(b * a + bg.b * (1 - a)),
  };
}

/** Accepts #rrggbb */
function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const lin = (c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const R = lin(r);
  const G = lin(g);
  const B = lin(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(fgHex, bgHex) {
  const L1 = relativeLuminance(fgHex);
  const L2 = relativeLuminance(bgHex);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

function rgbToHex({ r, g, b }) {
  const x = (n) => n.toString(16).padStart(2, "0");
  return `#${x(r)}${x(g)}${x(b)}`;
}

// Frosted panels: approximate composite over BASE_BG
const FROST_SUBTLE = rgbToHex(rgbaBlendOver(14, 20, 30, 0.74, BASE_BG));
const FROST_DEEP = rgbToHex(rgbaBlendOver(8, 14, 22, 0.88, BASE_BG));
const SURFACE = rgbToHex(rgbaBlendOver(16, 22, 32, 0.78, BASE_BG));

const COLORS = {
  textPrimary: "#eef3f9",
  textBody: "#b4c2d4",
  textMuted: "#a3b8cc",
  textGhost: "#242e3a",
  teal: "#5ec4c0",
  tealBright: "#7ddbd7",
  xp: "#d4a84b",
  xpBright: "#ecc96a",
  danger: "#c47080",
  moon: "#a8c4e8",
};

const BACKGROUNDS = [
  { id: "fq-bg-base", hex: BASE_BG },
  { id: "fq-bg-depth", hex: DEPTH_BG },
  { id: "fq-frost-subtle (composite)", hex: FROST_SUBTLE },
  { id: "fq-frost-deep (composite)", hex: FROST_DEEP },
  { id: "fq-surface (composite)", hex: SURFACE },
];

const PAIRS = [
  { fg: "textPrimary", label: "Primary headings / main copy" },
  { fg: "textBody", label: "Body / taglines (fq-skill-tagline)" },
  { fg: "textMuted", label: "Labels / secondary UI" },
  { fg: "teal", label: "Accent (teal)" },
  { fg: "tealBright", label: "Accent bright (teal)" },
  { fg: "xp", label: "XP / gold accent" },
  { fg: "xpBright", label: "XP bright" },
  { fg: "danger", label: "Danger / End session (example)" },
  { fg: "moon", label: "Moon / highlight copy" },
  { fg: "textGhost", label: "Decorative / ghost (expect low)" },
];

function grade(ratio, isLarge) {
  const aa = isLarge ? 3 : 4.5;
  const aaa = isLarge ? 4.5 : 7;
  const passAA = ratio >= aa;
  const passAAA = ratio >= aaa;
  return { passAA, passAAA, aa, aaa };
}

console.log("FocusQuest — token contrast audit\n");
console.log("Background composites (frost over", BASE_BG, "):");
console.log("  frost-subtle:", FROST_SUBTLE);
console.log("  frost-deep:  ", FROST_DEEP);
console.log("  surface:     ", SURFACE);
console.log("");

let failuresAA = [];
let failuresAAA = [];

for (const bg of BACKGROUNDS) {
  console.log(`── ${bg.id} (${bg.hex}) ──`);
  for (const pair of PAIRS) {
    const fgHex = COLORS[pair.fg];
    const ratio = contrastRatio(fgHex, bg.hex);
    const normal = grade(ratio, false);
    const large = grade(ratio, true);
    const status =
      pair.fg === "textGhost"
        ? "decorative"
        : normal.passAA && large.passAA
          ? "AA ✓"
          : normal.passAA
            ? "AA ✓ (large text only)"
            : "FAIL AA";

    console.log(
      `  ${pair.label.padEnd(38)} ${fgHex}  ${ratio.toFixed(2)}:1  ${status}`,
    );

    if (!normal.passAA && pair.fg !== "textGhost")
      failuresAA.push({ bg: bg.id, ...pair, ratio, fgHex });
    if (!normal.passAAA && pair.fg !== "textGhost") failuresAAA.push({ bg: bg.id, ...pair, ratio });
  }
  console.log("");
}

console.log("Legend: AA normal text needs 4.5:1; large text (18pt+ or 14pt+ bold) needs 3:1.");
console.log("");

if (failuresAA.length) {
  console.log("⚠️  Pairs below 4.5:1 (normal text) — review or use only for large/bold text:");
  for (const f of failuresAA) {
    console.log(`   - ${f.bg} × ${f.label} (${f.ratio.toFixed(2)}:1)`);
  }
  console.log("");
  process.exitCode = 1;
} else {
  console.log("✅ All sampled text/accents meet WCAG AA for normal text (4.5:1) on listed backgrounds.");
  console.log("   (--fq-text-ghost is intentionally low-contrast; use only for non-essential decoration.)");
}

if (failuresAAA.length && !failuresAA.length) {
  console.log("\nℹ️  Some pairs may still be below AAA (7:1) for body copy — optional polish.");
}
