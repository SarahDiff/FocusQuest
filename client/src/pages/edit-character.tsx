import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { useFQ } from "@/lib/fq-context";
import { type Bearing, type Character } from "@/lib/fq-data";
import CharacterAvatar from "@/components/character-avatar";

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
      />
    </div>
  );
}

export default function EditCharacter() {
  const { state, updateCharacter } = useFQ();
  const [, navigate] = useLocation();
  const char = state.character;

  const [name, setName] = useState(char?.name ?? 'Traveller');
  const [bearing, setBearing] = useState<Bearing>(char?.bearing ?? 'neutral');
  const [hairIndex, setHairIndex] = useState(char?.hairIndex ?? 1);
  const [hairLengthIndex, setHairLengthIndex] = useState(char?.hairLengthIndex ?? 3);
  const [skinIndex, setSkinIndex] = useState(char?.skinIndex ?? 2);
  const [eyeColorIndex, setEyeColorIndex] = useState(char?.eyeColorIndex ?? 2);

  useEffect(() => {
    if (!char) return;
    setName(char.name);
    setBearing(char.bearing);
    setHairIndex(char.hairIndex ?? 1);
    setHairLengthIndex(char.hairLengthIndex ?? 3);
    setSkinIndex(char.skinIndex ?? 2);
    setEyeColorIndex(char.eyeColorIndex ?? 2);
  }, [char]);

  function handleSave() {
    if (!char) return;
    const updated: Character = {
      ...char,
      name: name.trim() || 'Traveller',
      bearing,
      hairIndex,
      hairLengthIndex,
      skinIndex,
      eyeColorIndex,
    };
    updateCharacter(updated);
    navigate('/profile');
  }

  if (!char) {
    navigate('/profile');
    return null;
  }

  return (
    <div
      className="min-h-screen fq-scroll animate-fade-in"
      style={{ paddingTop: 24, paddingBottom: 48, paddingLeft: 24, paddingRight: 24 }}
    >
      <div className="w-full max-w-[360px] mx-auto">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-1 mb-6 cursor-pointer"
          style={{ background: 'none', border: 'none', color: 'var(--fq-text-muted)', fontSize: 12 }}
        >
          <ChevronLeft size={14} /> Back
        </button>

        <p
          className="font-display mb-1"
          style={{ fontSize: 10, letterSpacing: '0.26em', color: 'var(--fq-teal)', opacity: 0.8, textTransform: 'uppercase' }}
        >
          Character
        </p>
        <h1
          className="font-display font-bold mb-6"
          style={{ fontSize: 22, color: 'var(--fq-text-primary)', letterSpacing: '0.02em' }}
        >
          Edit Your Traveller
        </h1>

        <div className="flex items-center gap-4 mb-8">
          <CharacterAvatar name={name || 'T'} bearing={bearing} size="xl" />
          <div className="flex-1 min-w-0">
            <label
              className="font-display block mb-2"
              style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--fq-text-muted)', textTransform: 'uppercase' }}
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Traveller"
              maxLength={24}
              className="w-full font-serif transition-all duration-200"
              style={{
                background: 'var(--fq-inset)',
                border: '1px solid var(--fq-border)',
                borderRadius: 14,
                padding: '12px 16px',
                fontSize: 16,
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
        </div>

        <SectionDivider label="Appearance" />

        <SliderRow label="Hair" options={HAIR_OPTIONS} value={hairIndex} onChange={setHairIndex} />
        <SliderRow label="Hair Length" options={HAIR_LENGTH_OPTIONS} value={hairLengthIndex} onChange={setHairLengthIndex} />
        <SliderRow label="Skin Tone" options={SKIN_OPTIONS} value={skinIndex} onChange={setSkinIndex} />
        <SliderRow label="Eye Color" options={EYE_COLOR_OPTIONS} value={eyeColorIndex} onChange={setEyeColorIndex} />

        <SectionDivider label="Bearing" />

        <div className="flex gap-2 mb-8">
          {AVATAR_BEARINGS.map(b => {
            const selected = bearing === b.value;
            return (
              <button
                key={b.value}
                onClick={() => setBearing(b.value)}
                className="flex-1 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 rounded-2xl"
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
                  className="font-display uppercase"
                  style={{ fontSize: 8, letterSpacing: '0.12em', color: selected ? 'var(--fq-xp-bright)' : 'var(--fq-text-muted)' }}
                >
                  {b.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleSave}
          className="w-full font-display tracking-[0.14em] uppercase cursor-pointer transition-all duration-200"
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
          Save Changes
        </button>
      </div>
    </div>
  );
}
