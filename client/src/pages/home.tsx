import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronRight, X } from "lucide-react";
import { useFQ } from "@/lib/fq-context";
import {
  getSkillLevel,
  getSkillXPProgress,
  getTimeOfDayGreeting,
  formatDuration,
  DISCIPLINE_META,
  ALL_DISCIPLINES,
} from "@/lib/fq-data";
import XPBar from "@/components/xp-bar";
import questAvatar from "@assets/quest-avatar.png";

function SessionSheet({ onClose }: { onClose: () => void }) {
  const { state, startSession, activateDiscipline } = useFQ();
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<string | null>(null);
  const [targetMin, setTargetMin] = useState<number | null>(null);

  const { userDisciplines } = state;
  const activeDisciplines = [...userDisciplines].sort((a, b) => b.totalMinutes - a.totalMinutes);
  const inactiveDisciplines = ALL_DISCIPLINES.filter(
    id => !userDisciplines.some(d => d.disciplineId === id),
  );

  function handleBegin() {
    if (!selected) return;
    startSession(selected, targetMin);
    navigate('/session');
    onClose();
  }

  const durations = [
    { label: '25 min', value: 25 },
    { label: '45 min', value: 45 },
    { label: '1 hour', value: 60 },
    { label: 'Open', value: null },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[430px] rounded-t-3xl overflow-hidden animate-fade-in"
        style={{
          background: 'var(--fq-frost-deep)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--fq-border-mid)',
          borderBottom: 'none',
          maxHeight: '85svh',
          overflowY: 'auto',
        }}
      >
        <div className="flex justify-center pt-4 pb-2">
          <div className="rounded-full" style={{ width: 36, height: 3, background: 'var(--fq-border-mid)' }} />
        </div>

        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--fq-border)' }}>
          <div>
            <p className="font-display uppercase" style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-teal)', opacity: 0.85 }}>
              Begin the Quest
            </p>
            <h3 className="font-display font-semibold" style={{ fontSize: 18, color: 'var(--fq-text-primary)' }}>
              Choose Your Path
            </h3>
          </div>
          <button onClick={onClose} className="cursor-pointer" style={{ background: 'none', border: 'none', color: 'var(--fq-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4">
          {userDisciplines.length === 0 ? (
            <p className="font-serif italic text-center py-8" style={{ color: 'var(--fq-text-muted)', fontSize: 15 }}>
              Complete onboarding to choose a discipline.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {activeDisciplines.map(ud => {
                const meta = DISCIPLINE_META[ud.disciplineId];
                const sel = selected === ud.disciplineId;
                const level = getSkillLevel(ud.totalMinutes);
                return (
                  <button
                    key={ud.disciplineId}
                    onClick={() => setSelected(ud.disciplineId)}
                    className="flex items-center gap-4 w-full text-left cursor-pointer transition-all duration-200 rounded-2xl"
                    data-testid={`discipline-select-${ud.disciplineId}`}
                    style={{
                      background: sel ? 'rgba(94,196,192,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${sel ? 'var(--fq-border-teal)' : 'var(--fq-border)'}`,
                      padding: '12px 14px',
                      outline: 'none',
                      boxShadow: sel ? '0 0 14px rgba(94,196,192,0.15)' : 'none',
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{ width: 40, height: 40, background: sel ? 'rgba(94,196,192,0.12)' : 'rgba(255,255,255,0.04)', border: '1px solid var(--fq-border)' }}
                    >
                      <span className="font-display text-lg" style={{ color: sel ? 'var(--fq-teal)' : 'var(--fq-text-muted)' }}>
                        {meta.glyph}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-display font-medium truncate" style={{ fontSize: 13, color: sel ? 'var(--fq-text-primary)' : 'var(--fq-text-body)', letterSpacing: '0.04em' }}>
                          {meta.label}
                        </span>
                        <span className="font-display" style={{ fontSize: 9, color: 'var(--fq-teal)', letterSpacing: '0.06em' }}>
                          LVL {level}
                        </span>
                      </div>
                      <p className="fq-label-sm truncate">
                        {meta.tagline}
                      </p>
                    </div>
                    {sel && <ChevronRight size={16} style={{ color: 'var(--fq-teal)', flexShrink: 0 }} />}
                  </button>
                );
              })}
              {inactiveDisciplines.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mt-4 mb-1">
                    <div className="flex-1 h-px" style={{ background: 'var(--fq-border)' }} />
                    <span className="fq-label-sm">
                      More Paths
                    </span>
                    <div className="flex-1 h-px" style={{ background: 'var(--fq-border)' }} />
                  </div>
                  {inactiveDisciplines.map(id => {
                    const meta = DISCIPLINE_META[id];
                    const sel = selected === id;
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          activateDiscipline(id);
                          setSelected(id);
                        }}
                        className="flex items-center gap-4 w-full text-left cursor-pointer transition-all duration-200 rounded-2xl"
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--fq-border)',
                          padding: '12px 14px',
                          outline: 'none',
                          opacity: sel ? 0.7 : 0.5,
                        }}
                      >
                        <div
                          className="flex items-center justify-center rounded-lg flex-shrink-0"
                          style={{ width: 40, height: 40, background: 'rgba(15,19,24,0.8)', border: '1px solid var(--fq-border)' }}
                        >
                          <span className="font-display text-lg" style={{ color: 'var(--fq-text-muted)' }}>
                            {meta.glyph}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-display truncate" style={{ fontSize: 13, color: 'var(--fq-text-body)', letterSpacing: '0.04em' }}>
                              {meta.label}
                            </span>
                            <span className="fq-label-sm" style={{ letterSpacing: '0.1em' }}>
                              Inactive
                            </span>
                          </div>
                          <p className="fq-label-sm truncate" style={{ opacity: 0.9 }}>
                            {meta.tagline}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>

        {selected && (
          <div className="px-6 pb-4">
            <p className="fq-label mb-3">
              Duration
            </p>
            <div className="flex gap-2">
              {durations.map(d => (
                <button
                  key={String(d.value)}
                  onClick={() => setTargetMin(d.value)}
                  className="flex-1 font-display cursor-pointer transition-all duration-200 rounded-full py-2"
                  data-testid={`duration-${d.value}`}
                  style={{
                    fontSize: 10, letterSpacing: '0.1em',
                    background: targetMin === d.value ? 'rgba(94,196,192,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${targetMin === d.value ? 'var(--fq-border-teal)' : 'var(--fq-border)'}`,
                    color: targetMin === d.value ? 'var(--fq-teal-bright)' : 'var(--fq-text-muted)',
                    outline: 'none',
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-6 pb-8">
          <button
            onClick={handleBegin}
            disabled={!selected}
            className="w-full font-display tracking-[0.14em] uppercase cursor-pointer transition-all duration-200"
            data-testid="button-begin-session"
            style={{
              background: selected
                ? 'linear-gradient(135deg, rgba(30,55,70,0.9) 0%, rgba(18,38,50,0.95) 100%)'
                : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${selected ? 'var(--fq-border-teal)' : 'var(--fq-border)'}`,
              color: selected ? 'var(--fq-teal-bright)' : 'var(--fq-text-muted)',
              borderRadius: 999,
              padding: '16px',
              fontSize: 12,
              boxShadow: selected ? '0 0 24px rgba(94,196,192,0.22), 0 4px 20px rgba(0,0,0,0.5)' : 'none',
              opacity: selected ? 1 : 0.5,
              cursor: selected ? 'pointer' : 'not-allowed',
            }}
          >
            Enter the Realm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { state, clearPendingAvatarUpgrade } = useFQ();
  const [showSheet, setShowSheet] = useState(false);

  const char = state.character;
  const totalMinutes = state.userDisciplines.reduce((sum, d) => sum + d.totalMinutes, 0);
  const overallLevel = getSkillLevel(totalMinutes);
  const overallProgress = getSkillXPProgress(totalMinutes);
  const greeting = getTimeOfDayGreeting();
  const topDisciplines = [...state.userDisciplines]
    .sort((a, b) => b.totalMinutes - a.totalMinutes)
    .slice(0, 3);

  // Clear avatar glow after animation when returning from a level-up session
  useEffect(() => {
    if (!state.pendingAvatarUpgrade || !clearPendingAvatarUpgrade) return;
    const t = setTimeout(clearPendingAvatarUpgrade, 2500);
    return () => clearTimeout(t);
  }, [state.pendingAvatarUpgrade, clearPendingAvatarUpgrade]);

  return (
    <div className="min-h-[100svh] flex flex-col px-4 pb-4">
      {/* Hero — takes up most of the screen, avatar prominent */}
      <div
        className="relative flex flex-col items-center justify-center flex-1 min-h-0 pt-6 pb-4 animate-fade-in"
        style={{
          background: 'linear-gradient(180deg, rgba(14,20,32,0.98) 0%, rgba(8,13,22,0.99) 60%, transparent 100%)',
        }}
      >
        <p
          className="font-display uppercase text-center mb-3"
          style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-teal)', opacity: 0.85 }}
        >
          {greeting}
        </p>
        {/* Character portrait — rectangle, at least 480px tall so details are visible */}
        <div
          className={`relative w-full flex-1 min-h-[480px] max-h-[55svh] rounded-2xl overflow-hidden ${state.pendingAvatarUpgrade ? 'fq-avatar-glow' : ''}`}
          style={{
            border: '2px solid rgba(94,196,192,0.35)',
            boxShadow: '0 0 40px rgba(94,196,192,0.15), 0 0 80px rgba(94,196,192,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <img
            src={questAvatar}
            alt="Your Traveller"
            className="w-full h-full object-cover object-top"
            style={{ objectPosition: 'center 15%' }}
          />
        </div>
        <h1
          className="font-display font-bold mt-4 text-center"
          style={{ fontSize: 22, color: 'var(--fq-text-primary)', letterSpacing: '0.02em' }}
        >
          {char?.name || 'Traveller'}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          {char?.disciplines?.slice(0, 3).map(d => (
            <span
              key={d}
              className="font-display uppercase"
              style={{ fontSize: 8, letterSpacing: '0.12em', color: 'var(--fq-xp)', background: 'rgba(212,168,75,0.1)', border: '1px solid rgba(212,168,75,0.22)', borderRadius: 4, padding: '3px 8px' }}
            >
              {DISCIPLINE_META[d].label}
            </span>
          ))}
          <span
            className="font-display uppercase"
            style={{ fontSize: 8, letterSpacing: '0.12em', color: 'var(--fq-teal)', background: 'rgba(94,196,192,0.08)', border: '1px solid rgba(94,196,192,0.2)', borderRadius: 4, padding: '3px 8px' }}
          >
            Level {overallLevel}
          </span>
        </div>
        <div className="w-full max-w-[200px] mt-3">
          <XPBar pct={overallProgress.pct} height={4} />
          <p className="font-display text-center mt-1" style={{ fontSize: 9, color: 'var(--fq-xp-bright)' }}>{Math.round(overallProgress.pct)}% to next level</p>
        </div>
      </div>

      {/* Small section: skill level status cards */}
      {topDisciplines.length > 0 && (
        <div className="flex-shrink-0 mb-5 animate-fade-in">
          <p
            className="font-display uppercase mb-2 px-1"
            style={{ fontSize: 8, letterSpacing: '0.22em', color: 'var(--fq-text-muted)' }}
          >
            Skill levels
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {topDisciplines.map(ud => {
              const meta = DISCIPLINE_META[ud.disciplineId];
              const level = getSkillLevel(ud.totalMinutes);
              const prog = getSkillXPProgress(ud.totalMinutes);
              return (
                <div
                  key={ud.disciplineId}
                  className="flex-shrink-0 flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{
                    minWidth: 120,
                    background: 'var(--fq-frost-subtle)',
                    border: '1px solid var(--fq-border)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <span className="font-display text-xl" style={{ color: 'var(--fq-teal)' }}>{meta.glyph}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="font-display truncate uppercase" style={{ fontSize: 9, letterSpacing: '0.08em', color: 'var(--fq-text-primary)' }}>{meta.label}</span>
                      <span className="font-display uppercase flex-shrink-0" style={{ fontSize: 8, letterSpacing: '0.1em', color: 'var(--fq-teal)' }}>Lvl {level}</span>
                    </div>
                    <XPBar pct={prog.pct} height={2} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA — prominent at bottom */}
      <div className="flex-shrink-0 space-y-3">
        <button
          onClick={() => setShowSheet(true)}
          className="w-full font-display tracking-[0.16em] uppercase cursor-pointer transition-all duration-200"
          data-testid="button-begin-focus-session"
          style={{
            background: 'linear-gradient(135deg, rgba(30,55,70,0.95) 0%, rgba(18,38,50,1) 100%)',
            border: '1.5px solid var(--fq-border-teal)',
            color: 'var(--fq-teal-bright)',
            borderRadius: 999,
            padding: '18px 36px',
            fontSize: 13,
            boxShadow: '0 0 32px rgba(94,196,192,0.2), 0 4px 24px rgba(0,0,0,0.5)',
          }}
        >
          Begin Focus Session
        </button>
        <p className="font-serif italic text-center" style={{ fontSize: 13, color: 'var(--fq-text-muted)' }}>
          Each hour a stone laid on the path.
        </p>
      </div>

      {showSheet && <SessionSheet onClose={() => setShowSheet(false)} />}
    </div>
  );
}
