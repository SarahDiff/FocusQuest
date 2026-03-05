import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronRight, X } from "lucide-react";
import { useFQ } from "@/lib/fq-context";
import {
  getSkillLevel, getSkillXPProgress, getTimeOfDayGreeting,
  formatDuration, SKILLS_LIBRARY, DISCIPLINE_META,
  type UserSkill,
} from "@/lib/fq-data";
import XPBar from "@/components/xp-bar";
import CharacterAvatar from "@/components/character-avatar";
import SkillIcon from "@/components/skill-icon";

function SessionSheet({ onClose }: { onClose: () => void }) {
  const { state, startSession } = useFQ();
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<string | null>(null);
  const [targetMin, setTargetMin] = useState<number | null>(null);

  const activeSkills = state.userSkills.filter(s => s.isActive);

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
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="rounded-full" style={{ width: 36, height: 3, background: 'var(--fq-border-mid)' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--fq-border)' }}>
          <div>
            <p className="font-display uppercase" style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-teal)', opacity: 0.85 }}>
              Begin Session
            </p>
            <h3 className="font-display font-semibold" style={{ fontSize: 18, color: 'var(--fq-text-primary)' }}>
              Choose Your Skill
            </h3>
          </div>
          <button onClick={onClose} className="cursor-pointer" style={{ background: 'none', border: 'none', color: 'var(--fq-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Skills */}
        <div className="px-6 py-4">
          {activeSkills.length === 0 ? (
            <p className="font-serif italic text-center py-8" style={{ color: 'var(--fq-text-muted)', fontSize: 15 }}>
              Add skills in the Skills tab first.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {activeSkills.map(us => {
                const def = SKILLS_LIBRARY.find(s => s.id === us.skillId);
                if (!def) return null;
                const sel = selected === us.skillId;
                return (
                  <button
                    key={us.skillId}
                    onClick={() => setSelected(us.skillId)}
                    className="flex items-center gap-4 w-full text-left cursor-pointer transition-all duration-200 rounded-2xl"
                    data-testid={`skill-select-${us.skillId}`}
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
                      style={{
                        width: 40, height: 40,
                        background: sel ? 'rgba(94,196,192,0.12)' : 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--fq-border)',
                      }}
                    >
                      <SkillIcon iconName={def.icon} size={18} style={{ color: sel ? 'var(--fq-teal)' : 'var(--fq-text-muted)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-display font-medium truncate" style={{ fontSize: 13, color: sel ? 'var(--fq-text-primary)' : 'var(--fq-text-body)', letterSpacing: '0.04em' }}>
                          {def.name}
                        </span>
                        <span className="font-display" style={{ fontSize: 9, color: 'var(--fq-teal)', letterSpacing: '0.06em' }}>
                          LVL {getSkillLevel(us.totalMinutes)}
                        </span>
                      </div>
                      <p className="font-serif italic truncate" style={{ fontSize: 12, color: 'var(--fq-text-muted)' }}>
                        {def.description}
                      </p>
                    </div>
                    {sel && <ChevronRight size={16} style={{ color: 'var(--fq-teal)', flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Duration */}
        {selected && (
          <div className="px-6 pb-4">
            <p className="font-display uppercase mb-3" style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--fq-text-muted)' }}>
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

        {/* Begin button */}
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

function WeekRow() {
  const { state } = useFQ();
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toDateString();
    const hasSessions = state.sessions.some(s => new Date(s.date).toDateString() === dateStr);
    const isToday = i === 0;
    days.push({ d, hasSessions, isToday, label: d.toLocaleDateString('en', { weekday: 'narrow' }) });
  }

  return (
    <div className="flex items-center justify-between">
      {days.map(({ d, hasSessions, isToday, label }, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <span
            className="font-display uppercase"
            style={{ fontSize: 8, letterSpacing: '0.1em', color: isToday ? 'var(--fq-teal)' : 'var(--fq-text-muted)' }}
          >
            {label}
          </span>
          <div
            className="rounded-full"
            style={{
              width: 28, height: 28,
              background: hasSessions
                ? 'rgba(94,196,192,0.15)'
                : 'rgba(255,255,255,0.03)',
              border: isToday
                ? '1.5px solid var(--fq-teal)'
                : hasSessions
                  ? '1px solid rgba(94,196,192,0.3)'
                  : '1px solid var(--fq-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isToday ? '0 0 8px rgba(94,196,192,0.3)' : 'none',
            }}
          >
            {hasSessions && (
              <div className="rounded-full" style={{ width: 6, height: 6, background: 'var(--fq-teal)' }} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { state } = useFQ();
  const [showSheet, setShowSheet] = useState(false);

  const char = state.character;
  const activeSkills = state.userSkills.filter(s => s.isActive);
  const totalMinutes = state.userSkills.reduce((sum, s) => sum + s.totalMinutes, 0);
  const overallLevel = getSkillLevel(totalMinutes);
  const overallProgress = getSkillXPProgress(totalMinutes);
  const disciplineMeta = char ? DISCIPLINE_META[char.discipline] : null;
  const greeting = getTimeOfDayGreeting();

  return (
    <div className="px-5 pt-10 pb-4">
      {/* Greeting */}
      <div className="mb-6 animate-fade-in">
        <p className="font-display uppercase" style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-teal)', opacity: 0.8 }}>
          {greeting}
        </p>
        <h1 className="font-display font-bold" style={{ fontSize: 24, color: 'var(--fq-text-primary)', letterSpacing: '0.02em' }}>
          {char?.name || 'Traveller'}
        </h1>
      </div>

      {/* Character Card */}
      <div
        className="rounded-2xl mb-5 relative overflow-hidden animate-fade-in"
        style={{
          background: 'linear-gradient(145deg, rgba(14,20,32,0.95) 0%, rgba(8,13,22,0.98) 100%)',
          border: '1px solid var(--fq-border-mid)',
          boxShadow: 'var(--fq-shadow-card)',
        }}
      >
        {/* Teal top line */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(94,196,192,0.35) 50%, transparent)' }}
        />
        {/* Corner glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: -40, right: -40, width: 120, height: 120,
            background: 'radial-gradient(circle, rgba(94,196,192,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="flex items-center gap-4 p-5">
          <CharacterAvatar name={char?.name || 'T'} bearing={char?.bearing} size="lg" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-display font-bold truncate" style={{ fontSize: 18, color: 'var(--fq-text-primary)', letterSpacing: '0.02em' }}>
                {char?.name || 'Traveller'}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              {disciplineMeta && (
                <span
                  className="font-display uppercase"
                  style={{ fontSize: 8, letterSpacing: '0.14em', color: 'var(--fq-xp)', background: 'rgba(212,168,75,0.1)', border: '1px solid rgba(212,168,75,0.25)', borderRadius: 4, padding: '2px 7px' }}
                >
                  {disciplineMeta.label}
                </span>
              )}
              <span
                className="font-display uppercase"
                style={{ fontSize: 8, letterSpacing: '0.12em', color: 'var(--fq-teal)', background: 'rgba(94,196,192,0.08)', border: '1px solid rgba(94,196,192,0.2)', borderRadius: 4, padding: '2px 7px' }}
              >
                Level {overallLevel}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-display uppercase" style={{ fontSize: 8, letterSpacing: '0.14em', color: 'var(--fq-text-muted)' }}>Experience</span>
                <span className="font-display" style={{ fontSize: 9, color: 'var(--fq-xp-bright)' }}>{Math.round(overallProgress.pct)}%</span>
              </div>
              <XPBar pct={overallProgress.pct} height={4} />
            </div>
          </div>
        </div>

        {/* Total hours */}
        {totalMinutes > 0 && (
          <div className="px-5 pb-4 flex items-center gap-4">
            <div>
              <span className="font-display uppercase" style={{ fontSize: 7, letterSpacing: '0.18em', color: 'var(--fq-text-muted)', display: 'block' }}>Total Focus</span>
              <span className="font-display" style={{ fontSize: 15, color: 'var(--fq-text-body)' }}>{formatDuration(totalMinutes)}</span>
            </div>
            <div className="h-8" style={{ width: 1, background: 'var(--fq-border)' }} />
            <div>
              <span className="font-display uppercase" style={{ fontSize: 7, letterSpacing: '0.18em', color: 'var(--fq-text-muted)', display: 'block' }}>Sessions</span>
              <span className="font-display" style={{ fontSize: 15, color: 'var(--fq-text-body)' }}>{state.sessions.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Active Skills Row */}
      {activeSkills.length > 0 && (
        <div className="mb-5 animate-fade-in">
          <p className="font-display uppercase mb-3" style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-text-muted)' }}>
            Active Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {activeSkills.slice(0, 4).map(us => {
              const def = SKILLS_LIBRARY.find(s => s.id === us.skillId);
              if (!def) return null;
              const lvl = getSkillLevel(us.totalMinutes);
              return (
                <div
                  key={us.skillId}
                  className="inline-flex items-center gap-2 font-display"
                  style={{
                    background: 'var(--fq-surface)',
                    border: '1px solid var(--fq-border)',
                    borderRadius: 999,
                    padding: '6px 12px 6px 8px',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    color: 'var(--fq-text-body)',
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-md"
                    style={{ width: 22, height: 22, background: 'rgba(94,196,192,0.07)', borderRadius: 6 }}
                  >
                    <SkillIcon iconName={def.icon} size={12} style={{ color: 'var(--fq-teal)' }} />
                  </div>
                  <span>{def.name}</span>
                  <span style={{ color: 'var(--fq-teal)' }}>·{lvl}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly Activity */}
      <div
        className="rounded-2xl p-5 mb-6 animate-fade-in"
        style={{ background: 'var(--fq-frost-subtle)', backdropFilter: 'blur(14px)', border: '1px solid var(--fq-border)', boxShadow: 'var(--fq-shadow-card)' }}
      >
        <p className="font-display uppercase mb-4" style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-text-muted)' }}>
          This Week
        </p>
        <WeekRow />
      </div>

      {/* Primary CTA */}
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

      {/* Ambient footer */}
      <p
        className="font-serif italic text-center mt-5"
        style={{ fontSize: 13, color: 'var(--fq-text-muted)' }}
      >
        Each hour a stone laid on the path.
      </p>

      {showSheet && <SessionSheet onClose={() => setShowSheet(false)} />}
    </div>
  );
}
