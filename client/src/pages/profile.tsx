import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronRight, RotateCcw } from "lucide-react";
import { useFQ } from "@/lib/fq-context";
import { DISCIPLINE_META, getSkillLevel, getSkillXPProgress, formatDuration } from "@/lib/fq-data";
import XPBar from "@/components/xp-bar";
import CharacterAvatar from "@/components/character-avatar";

function SettingRow({ label, sub, onPress, danger = false }: {
  label: string;
  sub?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center justify-between py-4 cursor-pointer text-left"
      style={{ background: 'none', border: 'none', outline: 'none', borderBottom: '1px solid rgba(255,255,255,0.03)' }}
    >
      <div>
        <p
          className="font-display"
          style={{ fontSize: 13, color: danger ? '#c47080' : 'var(--fq-text-primary)', letterSpacing: '0.04em' }}
        >
          {label}
        </p>
        {sub && (
          <p className="font-serif italic" style={{ fontSize: 12, color: 'var(--fq-text-muted)', marginTop: 2 }}>
            {sub}
          </p>
        )}
      </div>
      <ChevronRight size={14} style={{ color: danger ? '#c47080' : 'var(--fq-text-muted)', flexShrink: 0 }} />
    </button>
  );
}

function ToggleRow({ label, sub, value, onToggle }: {
  label: string;
  sub?: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between py-4"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
    >
      <div>
        <p className="font-display" style={{ fontSize: 13, color: 'var(--fq-text-primary)', letterSpacing: '0.04em' }}>
          {label}
        </p>
        {sub && (
          <p className="font-serif italic" style={{ fontSize: 12, color: 'var(--fq-text-muted)', marginTop: 2 }}>
            {sub}
          </p>
        )}
      </div>
      <button
        onClick={onToggle}
        className="relative flex-shrink-0 cursor-pointer transition-all duration-250"
        style={{
          width: 38, height: 22,
          background: value ? 'rgba(94,196,192,0.2)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${value ? 'var(--fq-border-teal)' : 'var(--fq-border)'}`,
          borderRadius: 11,
          outline: 'none',
        }}
      >
        <div
          className="absolute rounded-full transition-all duration-250"
          style={{
            top: 3, left: value ? 19 : 3,
            width: 14, height: 14,
            background: value ? 'var(--fq-teal)' : 'var(--fq-text-muted)',
            boxShadow: value ? '0 0 8px rgba(94,196,192,0.5)' : 'none',
          }}
        />
      </button>
    </div>
  );
}

export default function Profile() {
  const { state, resetApp } = useFQ();
  const [, navigate] = useLocation();
  const [nudge, setNudge] = useState(false);
  const [shield, setShield] = useState(true);
  const [showReset, setShowReset] = useState(false);

  const char = state.character;
  const totalMinutes = state.userDisciplines.reduce((sum, d) => sum + d.totalMinutes, 0);
  const overallLevel = getSkillLevel(totalMinutes);
  const overallProg = getSkillXPProgress(totalMinutes);

  function handleReset() {
    resetApp();
    navigate('/');
  }

  if (!char) return null;

  return (
    <div className="px-5 pt-10 pb-4">
      {/* Header */}
      <div className="mb-6">
        <p
          className="font-display uppercase mb-1"
          style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-teal)', opacity: 0.8 }}
        >
          Your Realm
        </p>
        <h1
          className="font-display font-bold"
          style={{ fontSize: 24, color: 'var(--fq-text-primary)', letterSpacing: '0.02em' }}
        >
          Profile
        </h1>
      </div>

      {/* Character Hero Card */}
      <div
        className="rounded-2xl mb-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(14,20,32,0.95) 0%, rgba(8,13,22,0.98) 100%)',
          border: '1px solid var(--fq-border-mid)',
          boxShadow: 'var(--fq-shadow-card)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0"
          style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(94,196,192,0.4) 50%, transparent)' }}
        />
        <div
          className="absolute pointer-events-none"
          style={{ top: -40, right: -40, width: 120, height: 120, background: 'radial-gradient(circle, rgba(94,196,192,0.06) 0%, transparent 70%)' }}
        />

        <div className="p-6">
          <div className="flex items-start gap-5 mb-5">
            <CharacterAvatar name={char.name} bearing={char.bearing} size="xl" />

            <div className="flex-1 min-w-0 pt-1">
              <h2
                className="font-display font-bold mb-1"
                style={{ fontSize: 22, color: 'var(--fq-text-primary)', letterSpacing: '0.02em' }}
              >
                {char.name}
              </h2>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {char.disciplines?.map(d => (
                  <span
                    key={d}
                    className="font-display uppercase"
                    style={{
                      fontSize: 8, letterSpacing: '0.12em',
                      color: 'var(--fq-xp)',
                      background: 'rgba(212,168,75,0.1)',
                      border: '1px solid rgba(212,168,75,0.25)',
                      borderRadius: 4,
                      padding: '2px 8px',
                    }}
                  >
                    {DISCIPLINE_META[d].label}
                  </span>
                ))}
                <span
                  className="font-display uppercase"
                  style={{
                    fontSize: 8, letterSpacing: '0.12em',
                    color: 'var(--fq-teal)',
                    background: 'rgba(94,196,192,0.08)',
                    border: '1px solid rgba(94,196,192,0.2)',
                    borderRadius: 4,
                    padding: '2px 8px',
                  }}
                >
                  Level {overallLevel}
                </span>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="font-display uppercase" style={{ fontSize: 7, letterSpacing: '0.14em', color: 'var(--fq-text-muted)' }}>Experience</span>
                  <span className="font-display" style={{ fontSize: 9, color: 'var(--fq-xp-bright)' }}>{Math.round(overallProg.pct)}%</span>
                </div>
                <XPBar pct={overallProg.pct} height={4} />
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div
            className="flex items-stretch gap-0 rounded-xl overflow-hidden"
            style={{ border: '1px solid var(--fq-border)' }}
          >
            {[
              { label: 'Focus Time', value: formatDuration(totalMinutes) },
              { label: 'Sessions', value: String(state.sessions.length) },
              { label: 'Disciplines', value: String(state.userDisciplines.length) },
            ].map((s, i, arr) => (
              <div
                key={s.label}
                className="flex-1 text-center py-3"
                style={{ borderRight: i < arr.length - 1 ? '1px solid var(--fq-border)' : 'none' }}
              >
                <p className="font-display font-semibold" style={{ fontSize: 15, color: 'var(--fq-text-body)', marginBottom: 2 }}>
                  {s.value}
                </p>
                <p className="font-display uppercase" style={{ fontSize: 7, letterSpacing: '0.14em', color: 'var(--fq-text-muted)' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Focus Settings */}
      <div
        className="rounded-2xl px-5 mb-4"
        style={{
          background: 'var(--fq-frost-subtle)',
          backdropFilter: 'blur(14px)',
          border: '1px solid var(--fq-border)',
          boxShadow: 'var(--fq-shadow-card)',
        }}
      >
        <p
          className="font-display uppercase pt-5 mb-2"
          style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-text-muted)' }}
        >
          Focus Settings
        </p>
        <ToggleRow
          label="The Shield"
          sub="Holds distracting apps at bay during sessions"
          value={shield}
          onToggle={() => setShield(v => !v)}
        />
        <ToggleRow
          label="Daily Nudge"
          sub="Gentle, not a guilt trip"
          value={nudge}
          onToggle={() => setNudge(v => !v)}
        />
        <div style={{ paddingBottom: 4 }}>
          <SettingRow label="Minimum Session Duration" sub="15 minutes" />
        </div>
      </div>

      {/* Character Settings */}
      <div
        className="rounded-2xl px-5 mb-4"
        style={{
          background: 'var(--fq-frost-subtle)',
          backdropFilter: 'blur(14px)',
          border: '1px solid var(--fq-border)',
          boxShadow: 'var(--fq-shadow-card)',
        }}
      >
        <p
          className="font-display uppercase pt-5 mb-2"
          style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-text-muted)' }}
        >
          Character
        </p>
        <SettingRow label="Edit Character" sub="Name, avatar, bearing" />
        <div style={{ paddingBottom: 4 }}>
          <SettingRow label="Manage Skills" sub="Add or remove active skills" />
        </div>
      </div>

      {/* Danger zone */}
      <div
        className="rounded-2xl px-5 mb-6"
        style={{
          background: 'rgba(138,64,80,0.04)',
          border: '1px solid rgba(138,64,80,0.2)',
          boxShadow: 'var(--fq-shadow-card)',
        }}
      >
        <p
          className="font-display uppercase pt-5 mb-2"
          style={{ fontSize: 9, letterSpacing: '0.26em', color: '#c47080' }}
        >
          Realm
        </p>
        <div style={{ paddingBottom: 4 }}>
          <SettingRow label="Begin Anew" sub="Clear all progress and restart" onPress={() => setShowReset(true)} danger />
        </div>
      </div>

      {/* Ambient quote */}
      <p
        className="font-serif italic text-center"
        style={{ fontSize: 13, color: 'var(--fq-text-muted)' }}
      >
        {char.disciplines?.[0] ? DISCIPLINE_META[char.disciplines[0]].tagline : 'Your time. Your legend.'}
      </p>

      {/* Reset Confirmation Modal */}
      {showReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-[340px] rounded-2xl overflow-hidden"
            style={{
              background: 'var(--fq-frost-deep)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--fq-border-mid)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.7)',
            }}
          >
            <div className="p-6 text-center">
              <span className="font-display text-3xl block mb-4" style={{ color: '#c47080' }}>◎</span>
              <h3 className="font-display font-semibold mb-2" style={{ fontSize: 18, color: 'var(--fq-text-primary)', letterSpacing: '0.04em' }}>
                Begin Anew?
              </h3>
              <p className="font-serif italic mb-6" style={{ fontSize: 15, color: 'var(--fq-text-body)', lineHeight: 1.6 }}>
                All progress, sessions, and skills will be cleared. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReset(false)}
                  className="flex-1 font-display tracking-[0.12em] uppercase cursor-pointer py-3 rounded-full"
                  style={{
                    background: 'var(--fq-surface)',
                    border: '1px solid var(--fq-border-mid)',
                    color: 'var(--fq-text-body)',
                    fontSize: 10,
                  }}
                >
                  Stay
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 font-display tracking-[0.12em] uppercase cursor-pointer py-3 rounded-full flex items-center justify-center gap-2"
                  data-testid="button-confirm-reset"
                  style={{
                    background: 'rgba(138,64,80,0.15)',
                    border: '1px solid rgba(138,64,80,0.4)',
                    color: '#c47080',
                    fontSize: 10,
                  }}
                >
                  <RotateCcw size={12} />
                  Begin Anew
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
