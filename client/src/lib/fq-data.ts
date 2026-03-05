// ══════════════════════════════════════════════════
//  FocusQuest — Core Data Layer
// ══════════════════════════════════════════════════

export type Bearing = 'male' | 'neutral' | 'female';
export type Discipline = 'scholar' | 'warrior' | 'scribe' | 'adventurer';
export type SkillCategory = 'mind' | 'body' | 'creative' | 'social' | 'outdoors';

export interface Character {
  name: string;
  discipline: Discipline;
  bearing: Bearing;
  hairIndex?: number;
  hairLengthIndex?: number;
  skinIndex?: number;
  eyeColorIndex?: number;
}

export interface SkillDef {
  id: string;
  name: string;
  category: SkillCategory;
  icon: string;
  description: string;
}

export interface UserSkill {
  skillId: string;
  totalMinutes: number;
  isActive: boolean;
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
  userSkills: UserSkill[];
  sessions: Session[];
  activeSession: ActiveSessionData | null;
}

// ── Skill Library ──────────────────────────────────

export const SKILLS_LIBRARY: SkillDef[] = [
  // Mind
  { id: 'reading', name: 'Reading', category: 'mind', icon: 'BookOpen', description: 'Deep in the pages of worlds unknown.' },
  { id: 'studying', name: 'Studying', category: 'mind', icon: 'GraduationCap', description: 'Each concept a stone laid on the path.' },
  { id: 'language', name: 'Language Learning', category: 'mind', icon: 'Globe', description: 'New tongues open hidden realms.' },
  { id: 'meditation', name: 'Meditation', category: 'mind', icon: 'Moon', description: 'Stillness is its own kind of power.' },
  { id: 'chess', name: 'Chess', category: 'mind', icon: 'Crown', description: 'The ancient game of kings and patience.' },
  // Body
  { id: 'fitness', name: 'Fitness', category: 'body', icon: 'Dumbbell', description: 'The body is your first instrument.' },
  { id: 'running', name: 'Running', category: 'body', icon: 'Wind', description: 'Motion clears the mind and sharpens will.' },
  { id: 'yoga', name: 'Yoga', category: 'body', icon: 'Layers', description: 'Breath and form as one practice.' },
  { id: 'cycling', name: 'Cycling', category: 'body', icon: 'Bike', description: 'Miles become legend, slowly.' },
  { id: 'hiking', name: 'Hiking', category: 'body', icon: 'Mountain', description: 'The path itself is the reward.' },
  // Creative
  { id: 'writing', name: 'Writing', category: 'creative', icon: 'PenLine', description: 'Words are the spells you leave behind.' },
  { id: 'art', name: 'Drawing & Art', category: 'creative', icon: 'Palette', description: 'To see deeply is to create truly.' },
  { id: 'music', name: 'Music', category: 'creative', icon: 'Music', description: 'Sound shaped by will and feeling.' },
  { id: 'photography', name: 'Photography', category: 'creative', icon: 'Camera', description: 'Capturing light and meaning at once.' },
  { id: 'crafts', name: 'Crafts', category: 'creative', icon: 'Scissors', description: 'Making with hands is its own wisdom.' },
  // Social
  { id: 'conversation', name: 'Deep Conversation', category: 'social', icon: 'MessageCircle', description: 'True presence is a rare offering.' },
  { id: 'journaling', name: 'Journaling', category: 'social', icon: 'BookHeart', description: 'The self, examined, grows wiser.' },
  { id: 'community', name: 'Community Service', category: 'social', icon: 'Heart', description: 'Strength given freely returns tenfold.' },
  // Outdoors
  { id: 'nature', name: 'Nature Walks', category: 'outdoors', icon: 'Leaf', description: 'The world restores what noise takes away.' },
  { id: 'gardening', name: 'Gardening', category: 'outdoors', icon: 'Flower2', description: 'Growth, tended slowly, is the truest kind.' },
  { id: 'exploration', name: 'Exploration', category: 'outdoors', icon: 'Compass', description: 'Every horizon holds a new legend.' },
];

// ── Discipline → Starting Skills ──────────────────

export const DISCIPLINE_SKILLS: Record<Discipline, string[]> = {
  scholar:    ['reading', 'studying', 'language', 'meditation'],
  warrior:    ['fitness', 'running', 'hiking', 'yoga'],
  scribe:     ['writing', 'journaling', 'reading', 'art'],
  adventurer: ['hiking', 'photography', 'exploration', 'nature'],
};

export const DISCIPLINE_META: Record<Discipline, { label: string; tagline: string; description: string }> = {
  scholar:    { label: 'The Scholar', tagline: 'Seeker of wisdom', description: 'You pursue knowledge with quiet dedication. Books, study, and contemplation are your weapons.' },
  warrior:    { label: 'The Warrior', tagline: 'Forged by effort', description: 'Discipline of body is discipline of mind. You find truth through movement and endurance.' },
  scribe:     { label: 'The Scribe', tagline: 'Weaver of worlds', description: 'You give form to ideas others cannot yet name. The page is your realm.' },
  adventurer: { label: 'The Adventurer', tagline: 'Beyond the next horizon', description: 'Every journey changes you. You seek growth through exploration and discovery.' },
};

export const CATEGORY_LABELS: Record<SkillCategory, string> = {
  mind:     'Mind',
  body:     'Body',
  creative: 'Creative',
  social:   'Social',
  outdoors: 'Outdoors',
};

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

export function getSkillById(id: string): SkillDef | undefined {
  return SKILLS_LIBRARY.find(s => s.id === id);
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
  userSkills: [],
  sessions: [],
  activeSession: null,
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
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
