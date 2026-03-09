import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  type AppState,
  type Character,
  type UserDiscipline,
  type Session,
  type ActiveSessionData,
  DISCIPLINE_META,
  loadState,
  saveState,
  calculateXP,
} from "./fq-data";

interface FQContextValue {
  state: AppState;
  completeOnboarding: (character: Character) => void;
  startSession: (disciplineId: string, targetMinutes: number | null) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => Session | null;
  addSession: (session: Session) => void;
  resetApp: () => void;
  activateDiscipline: (id: string) => void;
  setShieldEnabled: (value: boolean) => void;
  setBlocklist: (items: string[]) => void;
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
    const userDisciplines: UserDiscipline[] = character.disciplines.map(d => ({
      disciplineId: d,
      totalMinutes: 0,
    }));

    setState(prev => ({
      ...prev,
      character,
      onboardingComplete: true,
      userDisciplines,
    }));
  }, [setState]);

  const startSession = useCallback((disciplineId: string, targetMinutes: number | null) => {
    const session: ActiveSessionData = {
      skillId: disciplineId,
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

      const disciplineMeta = DISCIPLINE_META[as.skillId as keyof typeof DISCIPLINE_META];
      const xpEarned = calculateXP(durationMinutes);

      const session: Session = {
        id: `session-${Date.now()}`,
        skillId: as.skillId,
        skillName: disciplineMeta?.label ?? as.skillId,
        durationMinutes,
        xpEarned,
        date: new Date().toISOString(),
      };

      completedSession = session;

      const updatedDisciplines = prev.userDisciplines.map(d =>
        d.disciplineId === as.skillId
          ? { ...d, totalMinutes: d.totalMinutes + durationMinutes }
          : d
      );

      return {
        ...prev,
        activeSession: null,
        sessions: [session, ...prev.sessions],
        userDisciplines: updatedDisciplines,
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

  const activateDiscipline = useCallback((id: string) => {
    setState(prev => {
      const exists = prev.userDisciplines.some(d => d.disciplineId === id);
      if (exists) return prev;
      return {
        ...prev,
        userDisciplines: [
          ...prev.userDisciplines,
          { disciplineId: id as any, totalMinutes: 0 },
        ],
      };
    });
  }, [setState]);

  const setShieldEnabled = useCallback((value: boolean) => {
    setState(prev => ({
      ...prev,
      shieldEnabled: value,
    }));
  }, [setState]);

  const setBlocklist = useCallback((items: string[]) => {
    setState(prev => ({
      ...prev,
      blocklist: items,
    }));
  }, [setState]);

  const resetApp = useCallback(() => {
    setState(() => ({
      character: null,
      onboardingComplete: false,
      userDisciplines: [],
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
      resetApp,
      activateDiscipline,
      setShieldEnabled,
      setBlocklist,
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
