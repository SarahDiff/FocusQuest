import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronRight, ChevronLeft, ChevronDown, User } from "lucide-react";
import { useFQ } from "@/lib/fq-context";
import { type Bearing, type Discipline, DISCIPLINE_META, ALL_DISCIPLINES } from "@/lib/fq-data";
import { SHIELD_APPS } from "@/lib/shield-apps";
import ShieldGlassAppTile from "@/components/shield-glass-app-tile";
import questAvatar from "@assets/quest-avatar.png";

type Step = 'splash' | 'philosophy' | 'identity' | 'avatar' | 'discipline' | 'shield' | 'quest';

const BEARINGS: { value: Bearing; label: string; glyph: string }[] = [
  { value: 'female', label: 'She / Her', glyph: '♀' },
  { value: 'neutral', label: 'They / Them', glyph: '◈' },
  { value: 'male', label: 'He / Him', glyph: '♂' },
];

const AVATAR_BEARINGS: { value: Bearing; label: string; glyph: string }[] = [
  { value: 'male', label: 'Male', glyph: '♂' },
  { value: 'neutral', label: 'Neutral', glyph: '◈' },
  { value: 'female', label: 'Female', glyph: '♀' },
];

const HAIR_OPTIONS = ['Raven Black', 'Tawny Brown', 'Amber Gold', 'Auburn Red', 'Ashen Blonde', 'Silver Grey'];
const HAIR_LENGTH_OPTIONS = ['Cropped', 'Short', 'Shoulder', 'Long Straight', 'Long Wavy', 'Curly Short', 'Curly Long'];
const SKIN_OPTIONS = ['Alabaster', 'Pale Rose', 'Sun-Kissed', 'Bronze', 'Copper', 'Ebony'];
const EYE_COLOR_OPTIONS = ['Storm Grey', 'Forest Green', 'Ocean Blue', 'Amber', 'Onyx', 'Violet'];

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-px" style={{ background: 'var(--fq-border)' }} />
      <span
        className="font-display uppercase"
        style={{ fontSize: 8, letterSpacing: '0.22em', color: 'var(--fq-text-muted)' }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: 'var(--fq-border)' }} />
    </div>
  );
}

function SliderRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-baseline mb-2">
        <span
          className="font-display uppercase"
          style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--fq-text-muted)' }}
        >
          {label}
        </span>
        <span
          className="font-serif italic"
          style={{ fontSize: 13, color: 'var(--fq-xp)', letterSpacing: '0.01em' }}
        >
          {options[value]}
        </span>
      </div>
      <input
        type="range"
        className="fq-slider"
        min={0}
        max={options.length - 1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        data-testid={`slider-${label.toLowerCase().replace(' ', '-')}`}
      />
    </div>
  );
}

export default function Onboarding() {
  const { completeOnboarding, setShieldEnabled, setBlocklist, state } = useFQ();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>('splash');
  const [name, setName] = useState('');
  const [bearing, setBearing] = useState<Bearing>('neutral');
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  function toggleDiscipline(d: Discipline) {
    if (disciplines.includes(d)) {
      setDisciplines(disciplines.filter(x => x !== d));
    } else if (disciplines.length < 3) {
      setDisciplines([...disciplines, d]);
    }
  }
  const [hairIndex, setHairIndex] = useState(1);
  const [hairLengthIndex, setHairLengthIndex] = useState(3);
  const [skinIndex, setSkinIndex] = useState(2);
  const [eyeColorIndex, setEyeColorIndex] = useState(2);
  const [shieldSelection, setShieldSelection] = useState<string[]>(state.blocklist || []);

  function next(to: Step) {
    setStep(to);
  }

  function finish() {
    if (disciplines.length === 0) return;
    completeOnboarding({ name: name.trim() || 'Traveller', disciplines, bearing, hairIndex, hairLengthIndex, skinIndex, eyeColorIndex });
    navigate('/');
  }

  const containerStyle: React.CSSProperties = {
    minHeight: '100svh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 32,
    paddingBottom: 32,
    paddingLeft: 24,
    paddingRight: 24,
    position: 'relative',
    zIndex: 10,
  };

  // ── Splash ──────────────────────────────────────────
  if (step === 'splash') {
    return (
      <div style={containerStyle}>
        {/* Sigil ring */}
        <div className="relative flex items-center justify-center mb-8 animate-float">
          <div
            className="absolute rounded-full"
            style={{
              width: 140, height: 140,
              border: '1px dashed rgba(94,196,192,0.25)',
              animation: 'spin-slow 16s linear infinite',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 110, height: 110,
              border: '1px solid rgba(94,196,192,0.12)',
            }}
          />
          <div
            className="font-display text-5xl font-bold"
            style={{ color: 'var(--fq-teal)', textShadow: '0 0 30px rgba(94,196,192,0.5)' }}
          >
            ◈
          </div>
        </div>

        {/* Wordmark */}
        <div className="text-center mb-4 animate-fade-in">
          <h1
            className="font-display font-bold tracking-[0.2em] uppercase mb-2"
            style={{ fontSize: 28, color: 'var(--fq-text-primary)', letterSpacing: '0.22em' }}
          >
            FocusQuest
          </h1>
          <p
            className="font-serif italic"
            style={{ fontSize: 16, color: 'var(--fq-moon)' }}
          >
            Your time. Your legend.
          </p>
        </div>

        <div className="h-px w-24 mb-10" style={{ background: 'var(--fq-border-mid)' }} />

        <p
          className="font-serif text-center mb-12 leading-relaxed max-w-[280px]"
          style={{ fontSize: 15, color: 'var(--fq-text-body)', fontStyle: 'italic' }}
        >
          A quiet realm where real effort becomes legend.
        </p>

        <button
          onClick={() => next('philosophy')}
          className="font-display tracking-[0.16em] uppercase cursor-pointer transition-all duration-200"
          data-testid="button-begin"
          style={{
            background: 'linear-gradient(135deg, rgba(30,55,70,0.9) 0%, rgba(18,38,50,0.95) 100%)',
            border: '1.5px solid var(--fq-border-teal)',
            color: 'var(--fq-teal-bright)',
            borderRadius: 999,
            padding: '15px 48px',
            fontSize: 12,
            letterSpacing: '0.16em',
            boxShadow: '0 0 24px rgba(94,196,192,0.22), 0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          Begin
        </button>
      </div>
    );
  }

  // ── Philosophy ─────────────────────────────────────
  if (step === 'philosophy') {
    return (
      <div style={containerStyle}>
        <div className="max-w-[320px] text-center animate-fade-in">
          {/* Geometric illustration */}
          <div className="flex items-center justify-center mb-10">
            <div className="relative" style={{ width: 120, height: 120 }}>
              <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(168,196,232,0.15)' }} />
              <div className="absolute rounded-full" style={{ inset: 16, border: '1px solid rgba(168,196,232,0.08)' }} />
              <div className="absolute rounded-full" style={{ inset: 32, border: '1px dashed rgba(94,196,192,0.2)' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-2xl" style={{ color: 'var(--fq-moon)' }}>◎</span>
              </div>
              {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                <div
                  key={angle}
                  className="absolute"
                  style={{
                    width: 3, height: 3, borderRadius: '50%',
                    background: 'rgba(94,196,192,0.3)',
                    top: '50%', left: '50%',
                    transform: `rotate(${angle}deg) translateX(52px) translate(-50%, -50%)`,
                  }}
                />
              ))}
            </div>
          </div>

          <p
            className="font-display mb-2"
            style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--fq-teal)', opacity: 0.75, textTransform: 'uppercase' }}
          >
            A different path
          </p>

          <h2
            className="font-display font-semibold mb-6"
            style={{ fontSize: 20, color: 'var(--fq-text-primary)', lineHeight: 1.3 }}
          >
            Time flows where attention goes.
          </h2>

          <p
            className="font-serif italic mb-4 leading-relaxed"
            style={{ fontSize: 16, color: 'var(--fq-text-body)' }}
          >
            Most apps pull you in. FocusQuest asks you to step away.
          </p>

          <p
            className="font-serif mb-10 leading-relaxed"
            style={{ fontSize: 15, color: 'var(--fq-text-muted)' }}
          >
            Start a session. Put your phone down. Return when your work is done.
            Your character grows while you're away.
          </p>

          <button
            onClick={() => next('identity')}
            className="font-display tracking-[0.14em] uppercase cursor-pointer transition-all duration-200 flex items-center gap-2 mx-auto"
            data-testid="button-philosophy-next"
            style={{
              background: 'linear-gradient(135deg, rgba(30,55,70,0.9) 0%, rgba(18,38,50,0.95) 100%)',
              border: '1.5px solid var(--fq-border-teal)',
              color: 'var(--fq-teal-bright)',
              borderRadius: 999,
              padding: '13px 36px',
              fontSize: 11,
              boxShadow: '0 0 20px rgba(94,196,192,0.18), 0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            Continue <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ── Identity ───────────────────────────────────────
  if (step === 'identity') {
    return (
      <div style={containerStyle}>
        <div className="w-full max-w-[360px] animate-fade-in">
          <button
            onClick={() => next('philosophy')}
            className="flex items-center gap-1 mb-8 cursor-pointer"
            style={{ background: 'none', border: 'none', color: 'var(--fq-text-muted)', fontSize: 12 }}
          >
            <ChevronLeft size={14} /> Back
          </button>

          <p
            className="font-display mb-2"
            style={{ fontSize: 10, letterSpacing: '0.26em', color: 'var(--fq-teal)', opacity: 0.8, textTransform: 'uppercase' }}
          >
            Your Identity
          </p>
          <h2
            className="font-display font-semibold mb-8"
            style={{ fontSize: 22, color: 'var(--fq-text-primary)' }}
          >
            What shall you be called?
          </h2>

          {/* Name input */}
          <div className="mb-10">
            <label
              className="font-display block mb-2"
              style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--fq-text-muted)', textTransform: 'uppercase' }}
            >
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Aelindra, Kael, The Wanderer..."
              maxLength={24}
              className="w-full font-serif transition-all duration-200"
              data-testid="input-character-name"
              style={{
                background: 'var(--fq-inset)',
                border: '1px solid var(--fq-border)',
                borderRadius: 14,
                padding: '14px 18px',
                fontSize: 17,
                color: 'var(--fq-text-primary)',
                outline: 'none',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--fq-border-teal)';
                e.target.style.boxShadow = '0 0 0 3px rgba(94,196,192,0.12)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--fq-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            onClick={() => next('avatar')}
            className="w-full font-display tracking-[0.14em] uppercase cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
            data-testid="button-identity-next"
            style={{
              background: 'linear-gradient(135deg, rgba(30,55,70,0.9) 0%, rgba(18,38,50,0.95) 100%)',
              border: '1.5px solid var(--fq-border-teal)',
              color: 'var(--fq-teal-bright)',
              borderRadius: 999,
              padding: '15px 36px',
              fontSize: 11,
              boxShadow: '0 0 20px rgba(94,196,192,0.18), 0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            Shape Your Form <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ── Avatar ──────────────────────────────────────────
  if (step === 'avatar') {

    return (
      <div
        style={{
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 10,
          overflowY: 'auto',
        }}
        className="fq-scroll animate-fade-in"
      >
        {/* Character portrait */}
        <div className="relative flex-shrink-0" style={{ height: 440 }}>
          <img
            src={questAvatar}
            alt="Your Traveller"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 10%',
              display: 'block',
            }}
          />
          {/* Gradient fade to background */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(15,19,24,0.25) 0%, rgba(15,19,24,0) 40%, rgba(15,19,24,0.85) 85%, #0f1318 100%)',
            }}
          />
          {/* Left gradient fade */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(15,19,24,0.3) 0%, transparent 30%, transparent 70%, rgba(15,19,24,0.3) 100%)' }}
          />
          {/* Back button */}
          <button
            onClick={() => next('identity')}
            className="absolute top-4 left-4 flex items-center gap-1 cursor-pointer"
            style={{
              background: 'rgba(15,19,24,0.6)',
              border: '1px solid var(--fq-border)',
              borderRadius: 999,
              padding: '6px 14px',
              color: 'var(--fq-text-muted)',
              fontSize: 12,
              backdropFilter: 'blur(8px)',
            }}
          >
            <ChevronLeft size={14} /> Back
          </button>
        </div>

        {/* Content */}
        <div
          className="flex-1 mx-auto w-full"
          style={{ maxWidth: 340, paddingLeft: 24, paddingRight: 24, paddingBottom: 40 }}
        >
          {/* Heading */}
          <div className="text-center mb-2 mt-5">
            <p
              className="font-display uppercase mb-1"
              style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-teal)', opacity: 0.8 }}
            >
              Your Form
            </p>
            <h2
              className="font-display font-bold"
              style={{ fontSize: 22, color: 'var(--fq-text-primary)', letterSpacing: '0.03em' }}
            >
              Shape Your Traveller
            </h2>
          </div>

          {/* APPEARANCE section */}
          <SectionDivider label="Appearance" />

          <SliderRow label="Hair" options={HAIR_OPTIONS} value={hairIndex} onChange={setHairIndex} />
          <SliderRow label="Hair Length" options={HAIR_LENGTH_OPTIONS} value={hairLengthIndex} onChange={setHairLengthIndex} />
          <SliderRow label="Skin Tone" options={SKIN_OPTIONS} value={skinIndex} onChange={setSkinIndex} />
          <SliderRow label="Eye Color" options={EYE_COLOR_OPTIONS} value={eyeColorIndex} onChange={setEyeColorIndex} />

          {/* BEARING section */}
          <SectionDivider label="Bearing" />

          <div className="flex gap-2 mb-2">
            {AVATAR_BEARINGS.map(b => {
              const selected = bearing === b.value;
              return (
                <button
                  key={b.value}
                  onClick={() => setBearing(b.value)}
                  className="flex-1 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 rounded-2xl"
                  data-testid={`button-bearing-${b.value}`}
                  style={{
                    paddingTop: 16,
                    paddingBottom: 16,
                    background: selected ? 'rgba(212,168,75,0.1)' : 'var(--fq-surface)',
                    border: `1.5px solid ${selected ? 'rgba(212,168,75,0.5)' : 'var(--fq-border)'}`,
                    outline: 'none',
                    boxShadow: selected ? '0 0 14px rgba(212,168,75,0.2)' : 'none',
                  }}
                >
                  <span
                    className="font-display"
                    style={{ fontSize: 18, color: selected ? 'var(--fq-xp)' : 'var(--fq-text-muted)' }}
                  >
                    {b.glyph}
                  </span>
                  <span
                    className="fq-label-sm"
                    style={{ color: selected ? 'var(--fq-xp-bright)' : 'var(--fq-text-muted)' }}
                  >
                    {b.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* OR divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px" style={{ background: 'var(--fq-border)' }} />
            <span className="fq-label-sm">or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--fq-border)' }} />
          </div>

          {/* Forge from your likeness */}
          <div
            className="rounded-2xl mb-6 flex items-center gap-4"
            style={{
              border: '1.5px dashed rgba(212,168,75,0.25)',
              padding: '18px 20px',
              background: 'rgba(212,168,75,0.03)',
            }}
          >
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-xl"
              style={{
                width: 48, height: 48,
                background: 'rgba(212,168,75,0.08)',
                border: '1px solid rgba(212,168,75,0.2)',
              }}
            >
              <User size={20} style={{ color: 'var(--fq-xp)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="font-display uppercase mb-1"
                style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--fq-xp-bright)' }}
              >
                Forge from your likeness
              </p>
              <p
                className="font-serif italic mb-3"
                style={{ fontSize: 12, color: 'var(--fq-text-muted)', lineHeight: 1.5 }}
              >
                Upload a photo and we'll craft a traveller in your image
              </p>
              <button
                className="font-display uppercase cursor-pointer transition-all duration-150"
                data-testid="button-ai-generation"
                style={{
                  fontSize: 8,
                  letterSpacing: '0.18em',
                  color: 'var(--fq-xp)',
                  background: 'rgba(212,168,75,0.1)',
                  border: '1px solid rgba(212,168,75,0.3)',
                  borderRadius: 999,
                  padding: '5px 14px',
                }}
              >
                ✦ AI Generation
              </button>
            </div>
          </div>

          {/* Continue button */}
          <button
            onClick={() => next('discipline')}
            className="w-full font-display tracking-[0.14em] uppercase cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
            data-testid="button-avatar-next"
            style={{
              background: 'linear-gradient(135deg, rgba(30,55,70,0.9) 0%, rgba(18,38,50,0.95) 100%)',
              border: '1.5px solid var(--fq-border-teal)',
              color: 'var(--fq-teal-bright)',
              borderRadius: 999,
              padding: '15px 36px',
              fontSize: 11,
              boxShadow: '0 0 20px rgba(94,196,192,0.18), 0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            Choose Your Path <ChevronDown size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ── Discipline ─────────────────────────────────────
  if (step === 'discipline') {
    const canProceed = disciplines.length > 0;
    const atMax = disciplines.length >= 3;

    return (
      <div style={{ ...containerStyle, justifyContent: 'flex-start', paddingTop: 48, paddingBottom: 48, overflowY: 'auto' }}
        className="fq-scroll animate-fade-in"
      >
        <div className="w-full max-w-[400px]">
          <button
            onClick={() => next('avatar')}
            className="flex items-center gap-1 mb-6 cursor-pointer"
            style={{ background: 'none', border: 'none', color: 'var(--fq-text-muted)', fontSize: 12 }}
          >
            <ChevronLeft size={14} /> Back
          </button>

          <p
            className="font-display mb-1"
            style={{ fontSize: 10, letterSpacing: '0.26em', color: 'var(--fq-teal)', opacity: 0.8, textTransform: 'uppercase' }}
          >
            Your Path
          </p>
          <h2
            className="font-display font-semibold mb-1"
            style={{ fontSize: 22, color: 'var(--fq-text-primary)' }}
          >
            Choose Your Paths
          </h2>
          <div className="flex items-center justify-between mb-6">
            <p className="font-serif italic" style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--fq-text-body)' }}>
              Pick up to three to begin with.
            </p>
            <span
              className="font-display uppercase"
              style={{
                fontSize: 11, letterSpacing: '0.12em',
                color: atMax ? 'var(--fq-xp)' : 'var(--fq-text-muted)',
                background: atMax ? 'rgba(212,168,75,0.1)' : 'transparent',
                border: `1px solid ${atMax ? 'rgba(212,168,75,0.3)' : 'transparent'}`,
                borderRadius: 999, padding: atMax ? '2px 8px' : '0',
                transition: 'all 0.2s',
              }}
            >
              {disciplines.length} / 3
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {ALL_DISCIPLINES.map(value => {
              const meta = DISCIPLINE_META[value];
              const selected = disciplines.includes(value);
              const disabled = !selected && atMax;
              return (
                <button
                  key={value}
                  onClick={() => toggleDiscipline(value)}
                  disabled={disabled}
                  className="transition-all duration-200 rounded-2xl text-left"
                  data-testid={`button-discipline-${value}`}
                  style={{
                    background: selected ? 'rgba(94,196,192,0.1)' : 'var(--fq-frost-subtle)',
                    border: `1.5px solid ${selected ? 'var(--fq-border-teal)' : 'var(--fq-border)'}`,
                    backdropFilter: 'blur(14px)',
                    borderRadius: 18,
                    padding: '14px 14px',
                    outline: 'none',
                    boxShadow: selected ? '0 0 18px rgba(94,196,192,0.18), var(--fq-shadow-card)' : 'var(--fq-shadow-card)',
                    opacity: disabled ? 0.38 : 1,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  <div
                    className="font-display text-xl mb-2"
                    style={{ color: selected ? 'var(--fq-teal)' : 'var(--fq-text-muted)', textShadow: selected ? '0 0 14px rgba(94,196,192,0.5)' : 'none' }}
                  >
                    {meta.glyph}
                  </div>
                  <div
                    className="font-display font-semibold mb-1"
                    style={{ fontSize: 14, color: selected ? 'var(--fq-text-primary)' : 'var(--fq-text-body)', letterSpacing: '0.03em' }}
                  >
                    {meta.label}
                  </div>
                  <div
                    className="fq-skill-tagline-compact line-clamp-3"
                    style={{ color: selected ? 'var(--fq-text-body)' : 'var(--fq-text-muted)' }}
                  >
                    {meta.tagline}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => canProceed && next('shield')}
            className="w-full font-display tracking-[0.14em] uppercase cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
            data-testid="button-discipline-next"
            disabled={!canProceed}
            style={{
              background: canProceed
                ? 'linear-gradient(135deg, rgba(30,55,70,0.9) 0%, rgba(18,38,50,0.95) 100%)'
                : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${canProceed ? 'var(--fq-border-teal)' : 'var(--fq-border)'}`,
              color: canProceed ? 'var(--fq-teal-bright)' : 'var(--fq-text-muted)',
              borderRadius: 999,
              padding: '15px 36px',
              fontSize: 13,
              boxShadow: canProceed ? '0 0 20px rgba(94,196,192,0.18), 0 4px 20px rgba(0,0,0,0.5)' : 'none',
              opacity: canProceed ? 1 : 0.5,
              cursor: canProceed ? 'pointer' : 'not-allowed',
            }}
          >
            Forge Your Legend <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ── The Shield ─────────────────────────────────────
  if (step === 'shield') {
    const toggleShieldApp = (id: string) => {
      setShieldSelection(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
      );
    };

    const handleSkip = () => {
      setShieldEnabled(false);
      setBlocklist([]);
      next('quest');
    };

    const handleRaise = () => {
      setShieldEnabled(true);
      setBlocklist(shieldSelection);
      next('quest');
    };

    return (
      <div style={{ ...containerStyle, justifyContent: 'flex-start', paddingTop: 48, paddingBottom: 48, overflowY: 'auto' }}
        className="fq-scroll animate-fade-in"
      >
        <div className="w-full max-w-[400px]">
          <button
            onClick={() => next('discipline')}
            className="flex items-center gap-1 mb-6 cursor-pointer"
            style={{ background: 'none', border: 'none', color: 'var(--fq-text-muted)', fontSize: 12 }}
          >
            <ChevronLeft size={14} /> Back
          </button>

          <p
            className="font-display mb-1"
            style={{ fontSize: 10, letterSpacing: '0.26em', color: 'var(--fq-teal)', opacity: 0.8, textTransform: 'uppercase' }}
          >
            The Shield
          </p>
          <h2
            className="font-display font-semibold mb-2"
            style={{ fontSize: 22, color: 'var(--fq-text-primary)' }}
          >
            What pulls you away?
          </h2>
          <p
            className="font-serif italic mb-6"
            style={{ fontSize: 15, color: 'var(--fq-text-body)' }}
          >
            Choose the places your attention wanders. The Shield will hold them at the edge of the realm while you work.
          </p>

          <div
            className="rounded-2xl mb-4"
            style={{
              background: 'var(--fq-frost-subtle)',
              backdropFilter: 'blur(14px)',
              border: '1px solid var(--fq-border)',
              boxShadow: 'var(--fq-shadow-card)',
            }}
          >
            <p
              className="font-display uppercase px-5 pt-5 mb-1"
              style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-text-muted)' }}
            >
              Shielded Paths
            </p>
            <p
              className="font-serif italic px-5 mb-4"
              style={{ fontSize: 13, color: 'var(--fq-text-muted)' }}
            >
              Tap each path that often steals your focus.
            </p>

            <div className="grid grid-cols-3 gap-3 px-5 pb-5">
              {SHIELD_APPS.map(app => (
                <ShieldGlassAppTile
                  key={app.id}
                  label={app.label}
                  Icon={app.Icon}
                  glyph={app.glyph}
                  gradient={app.gradient}
                  iconDark={app.iconDark}
                  selected={shieldSelection.includes(app.id)}
                  onToggle={() => toggleShieldApp(app.id)}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleRaise}
            className="w-full font-display tracking-[0.14em] uppercase cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, rgba(30,55,70,0.9) 0%, rgba(18,38,50,0.95) 100%)',
              border: '1.5px solid var(--fq-border-teal)',
              color: 'var(--fq-teal-bright)',
              borderRadius: 999,
              padding: '15px 36px',
              fontSize: 11,
              boxShadow: '0 0 20px rgba(94,196,192,0.18), 0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            Raise the Shield <ChevronRight size={14} />
          </button>

          <button
            onClick={handleSkip}
            className="mt-4 mx-auto block font-serif italic cursor-pointer"
            style={{ fontSize: 13, color: 'var(--fq-text-muted)', background: 'none', border: 'none' }}
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  // ── Quest Begins ───────────────────────────────────
  if (step === 'quest') {
    const displayName = name.trim() || 'Traveller';

    return (
      <div style={containerStyle}>
        <div className="w-full max-w-[360px] text-center animate-scale-in">
          {/* Character summary card */}
          <div
            className="rounded-2xl mb-8 p-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(14,20,32,0.95) 0%, rgba(8,13,22,0.98) 100%)',
              border: '1px solid var(--fq-border-mid)',
              boxShadow: 'var(--fq-shadow-card)',
            }}
          >
            {/* Teal top line */}
            <div
              className="absolute top-0 left-0 right-0"
              style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(94,196,192,0.4) 50%, transparent)' }}
            />

            {/* Avatar portrait above name */}
            <div
              className="rounded-2xl overflow-hidden mb-4"
              style={{
                height: 180,
                background: 'radial-gradient(circle at 20% 0%, rgba(94,196,192,0.22) 0%, transparent 55%)',
                border: '1px solid var(--fq-border)',
              }}
            >
              <img
                src={questAvatar}
                alt="Your Traveller"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 15%',
                  display: 'block',
                }}
              />
            </div>

            <div
              className="font-display mb-1"
              style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-teal)', textTransform: 'uppercase', opacity: 0.85 }}
            >
              The Traveller
            </div>
            <h3
              className="font-display font-bold mb-1"
              style={{ fontSize: 24, color: 'var(--fq-text-primary)', letterSpacing: '0.04em' }}
            >
              {displayName}
            </h3>
            <div className="flex flex-wrap justify-center gap-1.5 mt-1">
              {disciplines.map(d => (
                <span
                  key={d}
                  className="font-display uppercase"
                  style={{ fontSize: 8, letterSpacing: '0.12em', color: 'var(--fq-xp)', background: 'rgba(212,168,75,0.1)', border: '1px solid rgba(212,168,75,0.25)', borderRadius: 4, padding: '2px 7px' }}
                >
                  {DISCIPLINE_META[d].label}
                </span>
              ))}
            </div>
          </div>

          <p
            className="font-serif italic mb-10"
            style={{ fontSize: 16, color: 'var(--fq-moon)', lineHeight: 1.6 }}
          >
            Your legend begins now.
          </p>

          <button
            onClick={finish}
            className="w-full font-display tracking-[0.14em] uppercase cursor-pointer transition-all duration-200"
            data-testid="button-enter-quest"
            style={{
              background: 'linear-gradient(135deg, rgba(30,55,70,0.9) 0%, rgba(18,38,50,0.95) 100%)',
              border: '1.5px solid var(--fq-border-teal)',
              color: 'var(--fq-teal-bright)',
              borderRadius: 999,
              padding: '16px 36px',
              fontSize: 12,
              boxShadow: '0 0 28px rgba(94,196,192,0.25), 0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            Enter the Quest
          </button>
        </div>
      </div>
    );
  }

  return null;
}
