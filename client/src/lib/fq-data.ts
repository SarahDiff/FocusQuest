// ══════════════════════════════════════════════════
//  FocusQuest — Core Data Layer
// ══════════════════════════════════════════════════

export type Bearing = 'male' | 'neutral' | 'female';
export type Discipline =
  | 'scholar' | 'warrior' | 'scribe' | 'adventurer'
  | 'ranger' | 'alchemist' | 'bard' | 'monk';

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
}

// ── Discipline Metadata ────────────────────────────

export const DISCIPLINE_META: Record<Discipline, { label: string; tagline: string; description: string; glyph: string }> = {
  scholar:    { label: 'Scholar',    tagline: 'Seeker of wisdom',      description: 'You pursue knowledge with quiet dedication. Books, study, and contemplation are your weapons.',       glyph: '✦'  },
  warrior:    { label: 'Warrior',    tagline: 'Forged by effort',      description: 'Discipline of body is discipline of mind. You find truth through movement and endurance.',             glyph: '⚔'  },
  scribe:     { label: 'Scribe',     tagline: 'Weaver of worlds',      description: 'You give form to ideas others cannot yet name. The page is your realm.',                               glyph: '✒'  },
  adventurer: { label: 'Adventurer', tagline: 'Beyond the horizon',    description: 'Every journey changes you. You seek growth through exploration and discovery.',                         glyph: '◎'  },
  ranger:     { label: 'Ranger',     tagline: 'Trail & instinct',      description: 'Reading the land, moving with purpose. The wild is your domain and truest teacher.',                   glyph: '⬟'  },
  alchemist:  { label: 'Alchemist',  tagline: 'Transmute & create',    description: 'Turning experiment into mastery. You find wisdom in the laboratory of life.',                          glyph: '⬡'  },
  bard:       { label: 'Bard',       tagline: 'Voice & vision',        description: 'Weaving creativity into every endeavour. Art, music, and story are your craft.',                       glyph: '♬'  },
  monk:       { label: 'Monk',       tagline: 'Still & transcendent',  description: 'In stillness, the sharpest clarity is found. Body and spirit move as one.',                           glyph: '◇'  },
};

export const ALL_DISCIPLINES = Object.keys(DISCIPLINE_META) as Discipline[];

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
    }
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

// ── Session XP ────────────────────────────────────

export function calculateXP(minutes: number): number {
  return minutes; // 1 XP per minute
}
