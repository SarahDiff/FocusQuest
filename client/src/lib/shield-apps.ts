import type { LucideIcon } from "lucide-react";
import {
  Instagram,
  Music2,
  Facebook,
  Youtube,
  Gamepad2,
  ShoppingBag,
  Newspaper,
  Ghost,
  Sparkles,
  Package,
  Clapperboard,
} from "lucide-react";

/** Distraction apps shown on the Shield step — each gets a glass-style tile. */
export type ShieldAppDef = {
  id: string;
  label: string;
  /** Lucide icon, or null to use a text glyph (e.g. X) */
  Icon: LucideIcon | null;
  /** Single character when Icon is null */
  glyph?: string;
  /** Gradient behind the glass (hex) */
  gradient: string;
  /** Dark icon on light glass (e.g. Snapchat yellow) */
  iconDark?: boolean;
};

export const SHIELD_APPS: ShieldAppDef[] = [
  // Social (from original copy)
  { id: "instagram", label: "Instagram", Icon: Instagram, gradient: "linear-gradient(145deg, #f58529, #dd2a7b, #8134af)" },
  { id: "tiktok", label: "TikTok", Icon: Music2, gradient: "linear-gradient(145deg, #00f2ea, #ff0050)" },
  { id: "x", label: "X", Icon: null, glyph: "𝕏", gradient: "linear-gradient(145deg, #1a1a1a, #3d3d3d)" },
  { id: "facebook", label: "Facebook", Icon: Facebook, gradient: "linear-gradient(145deg, #1877f2, #0c63d4)" },
  { id: "snapchat", label: "Snapchat", Icon: Ghost, gradient: "linear-gradient(145deg, #fffc00, #e6e200)", iconDark: true },
  // Video
  { id: "youtube", label: "YouTube", Icon: Youtube, gradient: "linear-gradient(145deg, #ff0000, #cc0000)" },
  { id: "netflix", label: "Netflix", Icon: Clapperboard, gradient: "linear-gradient(145deg, #e50914, #b20710)" },
  { id: "disney-plus", label: "Disney+", Icon: Sparkles, gradient: "linear-gradient(145deg, #113ccf, #0a2472)" },
  // Games & play
  { id: "games", label: "Games", Icon: Gamepad2, gradient: "linear-gradient(145deg, #6366f1, #4338ca)" },
  // Shopping
  { id: "amazon", label: "Amazon", Icon: Package, gradient: "linear-gradient(145deg, #ff9900, #e47911)" },
  { id: "shopping", label: "Shopping apps", Icon: ShoppingBag, gradient: "linear-gradient(145deg, #d4a84b, #8b6914)" },
  // News
  { id: "news", label: "News apps", Icon: Newspaper, gradient: "linear-gradient(145deg, #a8c4e8, #5a7ab0)" },
];

/** Legacy category ids → expanded app ids (migration). */
export const SHIELD_LEGACY_CATEGORY_APPS: Record<string, string[]> = {
  social: ["instagram", "tiktok", "x", "facebook", "snapchat"],
  video: ["youtube", "netflix", "disney-plus"],
  games: ["games"],
  shopping: ["amazon", "shopping"],
  news: ["news"],
};
