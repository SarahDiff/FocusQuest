import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Pause, Play, Square, ChevronRight } from "lucide-react";
import { useFQ } from "@/lib/fq-context";
import { getSkillLevel, getSkillXPProgress, formatTimer, calculateXP, DISCIPLINE_META, type Session } from "@/lib/fq-data";
import XPBar from "@/components/xp-bar";
import RingEmbers from "@/components/ring-embers";
import characterImg from "@assets/ChatGPT_Image_Mar_5,_2026_at_08_15_07_PM_1772738146448.png";

// ── SVG Timer Ring (2x size: 320px) ─────────────────

function TimerRing({ pct }: { pct: number }) {
  const radius = 140;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
      <circle
        cx={cx} cy={cy} r={radius}
        fill="none"
        stroke="#d4a84b"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s linear', filter: 'drop-shadow(0 0 12px rgba(212,168,75,0.55))' }}
      />
    </svg>
  );
}

// ── Complete Screen ────────────────────────────────

function CompleteScreen({ session, prevLevel, newLevel, onReturn }: {
  session: Session;
  prevLevel: number;
  newLevel: number;
  onReturn: () => void;
}) {
  const { state } = useFQ();
  const disciplineMeta = DISCIPLINE_META[session.skillId as keyof typeof DISCIPLINE_META];
  const didLevelUp = newLevel > prevLevel;

  const h = Math.floor(session.durationMinutes / 60);
  const m = session.durationMinutes % 60;
  const durationStr = h > 0
    ? m > 0 ? `${h} hour${h > 1 ? 's' : ''} ${m} min` : `${h} hour${h > 1 ? 's' : ''}`
    : `${session.durationMinutes} min${session.durationMinutes !== 1 ? 's' : ''}`;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 relative"
      style={{ background: '#0f1318' }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(212,168,75,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Character portrait */}
      <div className="relative flex items-center justify-center mb-6" style={{ width: 120, height: 120 }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: '1px dashed rgba(212,168,75,0.35)', animation: 'spin-slow 8s linear infinite' }}
        />
        <div
          className="absolute rounded-full overflow-hidden"
          style={{ inset: 8, border: '2px solid rgba(212,168,75,0.5)', boxShadow: '0 0 20px rgba(212,168,75,0.3)' }}
        >
          <img
            src={characterImg}
            alt="Your Traveller"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }}
          />
        </div>
      </div>

      <p className="font-display uppercase mb-2 animate-fade-in" style={{ fontSize: 10, letterSpacing: '0.3em', color: 'var(--fq-teal)', opacity: 0.85 }}>
        Session Complete
      </p>
      <h1 className="font-display font-bold mb-8 animate-fade-in" style={{ fontSize: 32, color: 'var(--fq-text-primary)', letterSpacing: '0.04em', textAlign: 'center' }}>
        Quest Complete
      </h1>

      <div
        className="w-full max-w-[340px] rounded-2xl mb-6 overflow-hidden relative animate-scale-in"
        style={{
          background: 'linear-gradient(145deg, rgba(14,20,32,0.95) 0%, rgba(8,13,22,0.98) 100%)',
          border: '1px solid var(--fq-border-mid)',
          boxShadow: 'var(--fq-shadow-card)',
        }}
      >
        <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,168,75,0.4) 50%, transparent)' }} />

        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ width: 44, height: 44, background: 'rgba(94,196,192,0.08)', border: '1px solid var(--fq-border-teal)' }}
            >
              <span className="font-display text-xl" style={{ color: 'var(--fq-teal)' }}>
                {disciplineMeta?.glyph ?? '◎'}
              </span>
            </div>
            <div>
              <p className="font-display font-medium" style={{ fontSize: 14, color: 'var(--fq-text-primary)', letterSpacing: '0.04em' }}>
                {disciplineMeta?.label ?? session.skillName}
              </p>
              <p className="fq-label-sm">
                Level {newLevel}
              </p>
            </div>
          </div>

          <div className="flex items-stretch gap-4 mb-5">
            <div className="flex-1 text-center">
              <p className="fq-label-sm mb-1">Duration</p>
              <p className="font-display font-semibold" style={{ fontSize: 16, color: 'var(--fq-text-body)' }}>{durationStr}</p>
            </div>
            <div style={{ width: 1, background: 'var(--fq-border)' }} />
            <div className="flex-1 text-center">
              <p className="fq-label-sm mb-1">XP Earned</p>
              <p className="font-display font-bold" style={{ fontSize: 22, color: 'var(--fq-xp-bright)', textShadow: '0 0 16px rgba(212,168,75,0.5)' }}>
                +{session.xpEarned}
              </p>
            </div>
          </div>

          {didLevelUp && (
            <div
              className="rounded-xl p-3 mb-4 flex items-center gap-3"
              style={{ background: 'rgba(212,168,75,0.08)', border: '1px solid rgba(212,168,75,0.25)' }}
            >
              <span className="font-display text-xl" style={{ color: 'var(--fq-xp)' }}>⬆</span>
              <div>
                <p className="font-display font-semibold" style={{ fontSize: 12, color: 'var(--fq-xp-bright)', letterSpacing: '0.06em' }}>
                  Level Up — {disciplineMeta?.label}
                </p>
                <p className="fq-italic">
                  Reached Level {newLevel}
                </p>
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="fq-label-sm">Progress to Level {newLevel + 1}</span>
              <span className="font-display" style={{ fontSize: 12, color: 'var(--fq-xp-bright)' }}>{Math.round(getSkillXPProgress(newLevel * 60 - 30).pct)}%</span>
            </div>
            <XPBar pct={getSkillXPProgress(newLevel * 60 - 30).pct} height={5} />
          </div>
        </div>
      </div>

      <p className="font-serif italic text-center mb-8" style={{ fontSize: 14, color: 'var(--fq-moon)', maxWidth: 280 }}>
        The realm stirs as you work.
      </p>

      <button
        onClick={onReturn}
        className="font-display tracking-[0.14em] uppercase cursor-pointer transition-all duration-200 flex items-center gap-2"
        data-testid="button-return-realm"
        style={{
          background: 'linear-gradient(135deg, rgba(30,55,70,0.9) 0%, rgba(18,38,50,0.95) 100%)',
          border: '1.5px solid var(--fq-border-teal)',
          color: 'var(--fq-teal-bright)',
          borderRadius: 999,
          padding: '15px 40px',
          fontSize: 12,
          boxShadow: '0 0 24px rgba(94,196,192,0.22), 0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        Return to Realm <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ── Main Session Screen ────────────────────────────

export default function Session() {
  const { state, pauseSession, resumeSession, endSession } = useFQ();
  const [, navigate] = useLocation();
  const [elapsed, setElapsed] = useState(0);
  const [completedSession, setCompletedSession] = useState<Session | null>(null);
  const [prevLevel, setPrevLevel] = useState(0);
  const [newLevel, setNewLevel] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const as = state.activeSession;

  useEffect(() => {
    if (!as && !completedSession) navigate('/');
  }, [as, completedSession, navigate]);

  useEffect(() => {
    if (!as) return;
    const tick = () => {
      if (as.pausedAt !== null) return;
      const now = Date.now();
      const elapsedMs = now - as.startTime - as.totalPausedMs;
      setElapsed(Math.floor(elapsedMs / 1000));
    };
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [as]);

  if (!as && !completedSession) return null;

  if (completedSession) {
    return (
      <CompleteScreen
        session={completedSession}
        prevLevel={prevLevel}
        newLevel={newLevel}
        onReturn={() => navigate('/')}
      />
    );
  }

  const disciplineMeta = as ? DISCIPLINE_META[as.skillId as keyof typeof DISCIPLINE_META] : null;
  const userDiscipline = as ? state.userDisciplines.find(d => d.disciplineId === as.skillId) : null;
  const currentLevel = userDiscipline ? getSkillLevel(userDiscipline.totalMinutes) : 1;
  const currentXP = calculateXP(Math.floor(elapsed / 60));
  const isPaused = as?.pausedAt !== null;
  const targetSecs = as?.targetMinutes ? as.targetMinutes * 60 : null;
  const ringPct = targetSecs ? Math.min((elapsed / targetSecs) * 100, 100) : (elapsed % 3600) / 3600 * 100;

  function handlePauseResume() {
    if (isPaused) resumeSession();
    else pauseSession();
  }

  function handleEnd() {
    const prevLvl = userDiscipline ? getSkillLevel(userDiscipline.totalMinutes) : 1;
    const sess = endSession();
    if (sess) {
      const newLvl = getSkillLevel((userDiscipline?.totalMinutes || 0) + sess.durationMinutes);
      setPrevLevel(prevLvl);
      setNewLevel(newLvl);
      setCompletedSession(sess);
    } else {
      navigate('/');
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#090c10' }}>
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0,
          opacity: isPaused ? 0 : 1,
          transition: 'opacity 1.8s ease-out',
        }}
      >
        <RingEmbers />
      </div>
      <div
        className="absolute pointer-events-none"
        style={{ top: '30%', left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, background: 'radial-gradient(circle, rgba(212,168,75,0.08) 0%, transparent 70%)' }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ bottom: 0, left: '20%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(94,196,192,0.05) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 flex flex-col flex-1 min-h-0">
      <div className="flex justify-center pt-14 pb-4 shrink-0">
        <div
          className="inline-flex items-center gap-2 font-display uppercase"
          style={{
            background: 'rgba(94,196,192,0.08)',
            border: '1px solid var(--fq-border-teal)',
            borderRadius: 999,
            padding: '7px 16px',
            fontSize: 9,
            letterSpacing: '0.18em',
            color: 'var(--fq-teal)',
          }}
        >
          <span style={{ fontSize: 12 }}>{disciplineMeta?.glyph ?? '◎'}</span>
          {disciplineMeta?.label ?? 'Focus'}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <div className="relative flex items-center justify-center mb-3" style={{ width: 400, height: 400 }}>
          <div style={{ position: 'absolute', inset: 0, width: 320, height: 320, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            {!isPaused && (
              <div
                className="fq-focus-ring-pulse"
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
              />
            )}
            <TimerRing pct={ringPct} />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <span
              className="font-display font-bold"
              style={{ fontSize: 48, color: isPaused ? 'var(--fq-text-muted)' : 'var(--fq-text-primary)', letterSpacing: '0.04em', lineHeight: 1, transition: 'color 0.3s' }}
              data-testid="timer-display"
            >
              {formatTimer(elapsed)}
            </span>
            <span className="font-serif italic mt-2" style={{ fontSize: 12, color: 'var(--fq-text-muted)' }}>
              {isPaused ? 'paused' : targetSecs ? `of ${formatTimer(targetSecs)}` : 'in focus'}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span
            className="font-display font-bold"
            style={{ fontSize: 22, color: 'var(--fq-xp-bright)', textShadow: '0 0 16px rgba(212,168,75,0.5)' }}
            data-testid="xp-counter"
          >
            +{currentXP} XP
          </span>
          <span className="font-serif italic" style={{ fontSize: 12, color: 'var(--fq-text-muted)' }}>earned so far</span>
        </div>

        {userDiscipline && (
          <div className="mt-4 w-48">
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="font-display uppercase" style={{ fontSize: 7, letterSpacing: '0.14em', color: 'var(--fq-text-muted)' }}>
                Level {currentLevel}
              </span>
              <span className="font-display" style={{ fontSize: 8, color: 'var(--fq-xp)' }}>
                {Math.round(getSkillXPProgress(userDiscipline.totalMinutes + Math.floor(elapsed / 60)).pct)}%
              </span>
            </div>
            <XPBar pct={getSkillXPProgress(userDiscipline.totalMinutes + Math.floor(elapsed / 60)).pct} height={3} />
          </div>
        )}
      </div>

      <div className="px-6 pb-4 text-center">
        <p className="font-serif italic" style={{ fontSize: 13, color: 'var(--fq-text-muted)' }}>
          {isPaused ? 'The realm awaits your return.' : 'Stay in the moment.'}
        </p>
      </div>

      <div className="px-6 pb-10 pt-4 mt-auto" style={{ borderTop: '1px solid var(--fq-border)' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePauseResume}
            className="flex-1 flex items-center justify-center gap-2 font-display tracking-[0.12em] uppercase cursor-pointer transition-all duration-200"
            data-testid="button-pause-resume"
            style={{
              background: 'var(--fq-surface)',
              border: '1px solid var(--fq-border-mid)',
              color: 'var(--fq-text-body)',
              borderRadius: 999,
              padding: '14px',
              fontSize: 10,
              backdropFilter: 'blur(14px)',
            }}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>

          <button
            onClick={handleEnd}
            className="flex items-center justify-center gap-2 font-display tracking-[0.12em] uppercase cursor-pointer transition-all duration-200"
            data-testid="button-end-session"
            style={{
              background: 'rgba(138,64,80,0.12)',
              border: '1px solid rgba(138,64,80,0.3)',
              color: '#c47080',
              borderRadius: 999,
              padding: '14px 24px',
              fontSize: 10,
            }}
          >
            <Square size={14} />
            End
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
