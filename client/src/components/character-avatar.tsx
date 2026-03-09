import { useEffect } from "react";
import { type Bearing } from "@/lib/fq-data";

interface CharacterAvatarProps {
  name: string;
  bearing?: Bearing;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glowing?: boolean;
  onGlowComplete?: () => void;
}

const SIZE_MAP = {
  sm:  { outer: 40, inner: 34, font: 14 },
  md:  { outer: 56, inner: 48, font: 20 },
  lg:  { outer: 80, inner: 68, font: 28 },
  xl:  { outer: 100, inner: 86, font: 34 },
};

const GLOW_DURATION_MS = 2500;

export default function CharacterAvatar({ name, bearing = 'neutral', size = 'md', className = '', glowing = false, onGlowComplete }: CharacterAvatarProps) {
  const dim = SIZE_MAP[size];
  const initials = name.slice(0, 2).toUpperCase();

  const bearingGlyph = bearing === 'female' ? '♀' : bearing === 'male' ? '♂' : '◈';

  useEffect(() => {
    if (!glowing || !onGlowComplete) return;
    const t = setTimeout(onGlowComplete, GLOW_DURATION_MS);
    return () => clearTimeout(t);
  }, [glowing, onGlowComplete]);

  return (
    <div
      className={`relative flex-shrink-0 ${glowing ? 'fq-avatar-glow' : ''} ${className}`}
      style={{ width: dim.outer, height: dim.outer, borderRadius: '50%' }}
    >
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, rgba(94,196,192,0.4), rgba(212,168,75,0.2), rgba(94,196,192,0.4))',
          animation: 'spin-slow 12s linear infinite',
          padding: '1.5px',
        }}
      >
        <div className="w-full h-full rounded-full" style={{ background: '#0f1318' }} />
      </div>

      {/* Avatar circle */}
      <div
        className="absolute flex items-center justify-center rounded-full font-display font-bold"
        style={{
          inset: `${(dim.outer - dim.inner) / 2}px`,
          background: 'linear-gradient(145deg, rgba(14,20,32,0.95) 0%, rgba(8,13,22,0.98) 100%)',
          border: '1px solid rgba(94,196,192,0.35)',
          fontSize: `${dim.font}px`,
          color: 'var(--fq-teal)',
          textShadow: '0 0 16px rgba(94,196,192,0.5)',
          letterSpacing: '0.08em',
        }}
      >
        {initials}
      </div>

      {/* Bearing glyph — small indicator */}
      {size !== 'sm' && (
        <div
          className="absolute bottom-0 right-0 flex items-center justify-center rounded-full font-display"
          style={{
            width: dim.outer * 0.32,
            height: dim.outer * 0.32,
            background: '#0f1318',
            border: '1px solid rgba(212,168,75,0.3)',
            fontSize: dim.outer * 0.14,
            color: 'var(--fq-xp)',
            lineHeight: 1,
          }}
        >
          {bearingGlyph}
        </div>
      )}
    </div>
  );
}
