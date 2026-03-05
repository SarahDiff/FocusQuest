import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  type AppState,
  type Character,
  type UserSkill,
  type Session,
  type ActiveSessionData,
  type Discipline,
  DISCIPLINE_SKILLS,
  loadState,
  saveState,
  calculateXP,
} from "./fq-data";

interface FQContextValue {
  state: AppState;
  completeOnboarding: (character: Character) => void;
  startSession: (skillId: string, targetMinutes: number | null) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => Session | null;
  addSession: (session: Session) => void;
  toggleSkillActive: (skillId: string) => void;
  resetApp: () => void;
}

const FQContext = createContext<FQContextValue | null>(null);

export function FQProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<AppState>(() => loadState());

  const setState = useCallback((updater: (prev: AppState) => AppState) => {
    setStateRaw(prev => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  const completeOnboarding = useCallback((character: Character) => {
    const startingSkillIds = DISCIPLINE_SKILLS[character.discipline];
    const userSkills: UserSkill[] = startingSkillIds.map(id => ({
      skillId: id,
      totalMinutes: 0,
      isActive: true,
    }));

    setState(prev => ({
      ...prev,
      character,
      onboardingComplete: true,
      userSkills,
    }));
  }, [setState]);

  const startSession = useCallback((skillId: string, targetMinutes: number | null) => {
    const session: ActiveSessionData = {
      skillId,
      startTime: Date.now(),
      pausedAt: null,
      totalPausedMs: 0,
      targetMinutes,
    };
    setState(prev => ({ ...prev, activeSession: session }));
  }, [setState]);

  const pauseSession = useCallback(() => {
    setState(prev => {
      if (!prev.activeSession || prev.activeSession.pausedAt !== null) return prev;
      return {
        ...prev,
        activeSession: { ...prev.activeSession, pausedAt: Date.now() },
      };
    });
  }, [setState]);

  const resumeSession = useCallback(() => {
    setState(prev => {
      if (!prev.activeSession || prev.activeSession.pausedAt === null) return prev;
      const additionalPaused = Date.now() - prev.activeSession.pausedAt;
      return {
        ...prev,
        activeSession: {
          ...prev.activeSession,
          pausedAt: null,
          totalPausedMs: prev.activeSession.totalPausedMs + additionalPaused,
        },
      };
    });
  }, [setState]);

  const endSession = useCallback((): Session | null => {
    let completedSession: Session | null = null;

    setState(prev => {
      if (!prev.activeSession) return prev;

      const as = prev.activeSession;
      const now = Date.now();
      const endTime = as.pausedAt !== null ? as.pausedAt : now;
      const elapsedMs = endTime - as.startTime - as.totalPausedMs;
      const durationMinutes = Math.floor(elapsedMs / 60000);

      if (durationMinutes < 1) {
        completedSession = null;
        return { ...prev, activeSession: null };
      }

      const skillDef = prev.userSkills.find(s => s.skillId === as.skillId);
      const skillName = as.skillId;
      const xpEarned = calculateXP(durationMinutes);

      const session: Session = {
        id: `session-${Date.now()}`,
        skillId: as.skillId,
        skillName,
        durationMinutes,
        xpEarned,
        date: new Date().toISOString(),
      };

      completedSession = session;

      const updatedSkills = prev.userSkills.map(s =>
        s.skillId === as.skillId
          ? { ...s, totalMinutes: s.totalMinutes + durationMinutes }
          : s
      );

      return {
        ...prev,
        activeSession: null,
        sessions: [session, ...prev.sessions],
        userSkills: updatedSkills,
      };
    });

    return completedSession;
  }, [setState]);

  const addSession = useCallback((session: Session) => {
    setState(prev => ({
      ...prev,
      sessions: [session, ...prev.sessions],
    }));
  }, [setState]);

  const toggleSkillActive = useCallback((skillId: string) => {
    setState(prev => {
      const existing = prev.userSkills.find(s => s.skillId === skillId);
      if (existing) {
        return {
          ...prev,
          userSkills: prev.userSkills.map(s =>
            s.skillId === skillId ? { ...s, isActive: !s.isActive } : s
          ),
        };
      } else {
        return {
          ...prev,
          userSkills: [...prev.userSkills, { skillId, totalMinutes: 0, isActive: true }],
        };
      }
    });
  }, [setState]);

  const resetApp = useCallback(() => {
    setState(() => ({
      character: null,
      onboardingComplete: false,
      userSkills: [],
      sessions: [],
      activeSession: null,
    }));
  }, [setState]);

  return (
    <FQContext.Provider value={{
      state,
      completeOnboarding,
      startSession,
      pauseSession,
      resumeSession,
      endSession,
      addSession,
      toggleSkillActive,
      resetApp,
    }}>
      {children}
    </FQContext.Provider>
  );
}

export function useFQ() {
  const ctx = useContext(FQContext);
  if (!ctx) throw new Error("useFQ must be used within FQProvider");
  return ctx;
}
