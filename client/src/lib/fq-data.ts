// ══════════════════════════════════════════════════
//  FocusQuest — Core Data Layer
// ══════════════════════════════════════════════════

import { SHIELD_APPS, SHIELD_LEGACY_CATEGORY_APPS } from "./shield-apps";

export type Bearing = 'male' | 'neutral' | 'female';
export type Discipline =
  | 'warrior'
  | 'scholar'
  | 'charm'
  | 'bard'
  | 'steward'
  | 'ranger'
  | 'adventurer'
  | 'monk'
  | 'architect'
  | 'alchemist'
  | 'artisan'
  | 'scribe'
  | 'lore';

export interface Character {
  name: string;
  disciplines: Discipline[];
  bearing: Bearing;
  hairIndex?: number;
  hairLengthIndex?: number;
  skinIndex?: number;
  eyeColorIndex?: number;
}

export interface UserDiscipline {
  disciplineId: Discipline;
  totalMinutes: number;
}

export interface Session {
  id: string;
  skillId: string;
  skillName: string;
  durationMinutes: number;
  xpEarned: number;
  date: string;
}

export interface ActiveSessionData {
  skillId: string;
  startTime: number;
  pausedAt: number | null;
  totalPausedMs: number;
  targetMinutes: number | null;
}

export interface AppState {
  character: Character | null;
  onboardingComplete: boolean;
  userDisciplines: UserDiscipline[];
  sessions: Session[];
  activeSession: ActiveSessionData | null;
  shieldEnabled: boolean;
  blocklist: string[];
  nudgeEnabled: boolean;
  minSessionMinutes: number;
  pendingAvatarUpgrade: boolean;
}

// ── Discipline Metadata ────────────────────────────

export const DISCIPLINE_META: Record<Discipline, { label: string; tagline: string; description: string; glyph: string }> = {
  warrior: {
    label: 'Warrior',
    tagline: 'Strength & motion — exercise, sport, training',
    description:
      'Use this path when you are moving your body on purpose: gym sessions, runs, sports, stretching, or anything that builds strength and stamina.',
    glyph: '⚔',
  },
  scholar: {
    label: 'Scholar',
    tagline: 'Wisdom seeking — study, courses, deep learning',
    description:
      'Use this path when you are learning with intent: classes, reading to understand, flashcards, languages, certifications, or focused skill practice.',
    glyph: '✦',
  },
  charm: {
    label: 'Charm',
    tagline: 'Hearts & company — social time, friends, community',
    description:
      'Use this path when you are investing in people: conversations, gatherings, networking, family time, or anything that nourishes connection.',
    glyph: '❖',
  },
  bard: {
    label: 'Bard',
    tagline: 'Song & sound — music practice, performance, listening',
    description:
      'Use this path when music is the work: instrument practice, voice work, composing, rehearsals, ear training, or deep listening as your focus.',
    glyph: '♪',
  },
  steward: {
    label: 'Steward',
    tagline: 'Hearth & order — cleaning, tidying, upkeep',
    description:
      'Use this path when you are caring for space: laundry, dishes, decluttering, organizing, maintenance, or turning chaos back into calm.',
    glyph: '⌂',
  },
  ranger: {
    label: 'Guardian',
    tagline: 'Care & keeping — caretaking for people and creatures',
    description:
      'Use this path when someone else is the focus: children, elders, partners, pets, caregiving tasks, or steady support for those who rely on you.',
    glyph: '⬟',
  },
  adventurer: {
    label: 'Adventure',
    tagline: 'Wilds & wander — outdoors, hiking, nature sport',
    description:
      'Use this path when you are outside and moving: trails, parks, climbing, cycling in nature, camping prep—anything that belongs under open sky.',
    glyph: '◎',
  },
  monk: {
    label: 'Monk',
    tagline: 'Breath & stillness — meditation, mindfulness',
    description:
      'Use this path when you are settling the mind and body: seated practice, breathwork, contemplation, gentle yoga meant as inner work, not exercise.',
    glyph: '◇',
  },
  architect: {
    label: 'Architect',
    tagline: 'Plans & depth — focused work and big projects',
    description:
      'Use this path for professional or serious projects: deep work blocks, building products, strategy, writing reports, or anything that needs sustained attention.',
    glyph: '⛶',
  },
  alchemist: {
    label: 'Alchemy',
    tagline: 'Fire & feasting — cooking and kitchen craft',
    description:
      'Use this path when the kitchen is your quest: meal prep, baking, recipe experiments, batch cooking—anything where food is the main focus.',
    glyph: '⬡',
  },
  artisan: {
    label: 'Artisan',
    tagline: 'Hand & eye — art, craft, design, making',
    description:
      'Use this path when you are making something tangible or visual: drawing, painting, sculpture, pottery, digital art, photography, or detailed craft.',
    glyph: '✶',
  },
  scribe: {
    label: 'Scribe',
    tagline: 'Pages & voice — journaling and creative writing',
    description:
      'Use this path when words are the craft: morning pages, fiction, poetry, scripting, blogging for yourself—writing that is not mainly “studying.”',
    glyph: '✒',
  },
  lore: {
    label: 'Lore',
    tagline: 'Tales & tomes — reading for pleasure',
    description:
      'Use this path when you read for joy or immersion: novels, comics, long-form articles for fun—distinct from study or work reading.',
    glyph: '☾',
  },
};

// Display order: table paths + Bard (music) after Charm
export const ALL_DISCIPLINES: Discipline[] = [
  'warrior',
  'scholar',
  'charm',
  'bard',
  'steward',
  'ranger',
  'adventurer',
  'monk',
  'architect',
  'alchemist',
  'artisan',
  'scribe',
  'lore',
];

// ── Leveling ──────────────────────────────────────

export function getSkillLevel(totalMinutes: number): number {
  return Math.floor(totalMinutes / 60) + 1;
}

export function getSkillXPProgress(totalMinutes: number): { currentMin: number; nextMin: number; pct: number } {
  const currentLevelMin = Math.floor(totalMinutes / 60) * 60;
  const nextLevelMin = currentLevelMin + 60;
  const pct = ((totalMinutes - currentLevelMin) / 60) * 100;
  return { currentMin: currentLevelMin, nextMin: nextLevelMin, pct };
}

export function getOverallLevel(totalMinutes: number): number {
  return getSkillLevel(totalMinutes);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatTimer(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

export function getTimeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return 'Still the night';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'The night deepens';
}

// ── Local Storage ─────────────────────────────────

const STORAGE_KEY = 'focusquest_v1';

const DEFAULT_STATE: AppState = {
  character: null,
  onboardingComplete: false,
  userDisciplines: [],
  sessions: [],
  activeSession: null,
  shieldEnabled: false,
  blocklist: [],
  nudgeEnabled: false,
  minSessionMinutes: 15,
  pendingAvatarUpgrade: false,
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    // Migration: old data had userSkills → convert to userDisciplines
    if (parsed.userSkills && !parsed.userDisciplines) {
      parsed.userDisciplines = [];
      delete parsed.userSkills;
    }
    // Migration: old character had single discipline → array
    if (parsed.character?.discipline && !parsed.character?.disciplines) {
      parsed.character.disciplines = [parsed.character.discipline];
      delete parsed.character.discipline;
    }
    // Ensure new fields exist
    if (typeof parsed.shieldEnabled !== 'boolean') {
      parsed.shieldEnabled = false;
    }
    if (!Array.isArray(parsed.blocklist)) {
      parsed.blocklist = [];
    } else {
      parsed.blocklist = migrateShieldBlocklist(parsed.blocklist as string[]);
    }
    if (typeof parsed.nudgeEnabled !== 'boolean') {
      parsed.nudgeEnabled = false;
    }
    if (typeof parsed.minSessionMinutes !== 'number' || parsed.minSessionMinutes < 1) {
      parsed.minSessionMinutes = 15;
    }
    if (typeof parsed.pendingAvatarUpgrade !== 'boolean') {
      parsed.pendingAvatarUpgrade = false;
    }
    // Migration: socializing path was stored as id "bard" → now "charm"; "bard" is music
    migrateLegacyBardToCharm(parsed);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

const KNOWN_SHIELD_APP_IDS = new Set(SHIELD_APPS.map(a => a.id));

/** Expand legacy category ids (social, video, …) into per-app shield ids; drop removed app ids. */
function migrateShieldBlocklist(ids: string[]): string[] {
  const next: string[] = [];
  for (const id of ids) {
    const legacy = SHIELD_LEGACY_CATEGORY_APPS[id];
    if (legacy) next.push(...legacy);
    else next.push(id);
  }
  return Array.from(new Set(next)).filter(id => KNOWN_SHIELD_APP_IDS.has(id));
}

/** Old saves used disciplineId/skillId "bard" for socializing (now "charm"). */
function migrateLegacyBardToCharm(parsed: Record<string, unknown>): void {
  if (Array.isArray(parsed.userDisciplines)) {
    parsed.userDisciplines = (parsed.userDisciplines as UserDiscipline[]).map(ud =>
      ud.disciplineId === 'bard' ? { ...ud, disciplineId: 'charm' as Discipline } : ud,
    );
  }

  if (Array.isArray(parsed.sessions)) {
    parsed.sessions = (parsed.sessions as Session[]).map(s =>
      s.skillId === 'bard'
        ? { ...s, skillId: 'charm', skillName: 'Charm' }
        : s,
    );
  }

  const as = parsed.activeSession as ActiveSessionData | null | undefined;
  if (as && as.skillId === 'bard') {
    parsed.activeSession = { ...as, skillId: 'charm' };
  }

  const char = parsed.character as Character | null | undefined;
  if (char?.disciplines?.length) {
    parsed.character = {
      ...char,
      disciplines: char.disciplines.map(d => (d === 'bard' ? 'charm' : d)),
    };
  }
}

// ── Session XP ────────────────────────────────────

export function calculateXP(minutes: number): number {
  return minutes; // 1 XP per minute
}
