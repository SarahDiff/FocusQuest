import type { LucideIcon } from "lucide-react";

const ICON_SIZE = 26;

type Props = {
  label: string;
  Icon: LucideIcon | null;
  glyph?: string;
  gradient: string;
  iconDark?: boolean;
  selected: boolean;
  onToggle: () => void;
};

/**
 * iOS-style squircle with glass treatment (blur, specular edge, depth).
 */
export default function ShieldGlassAppTile({ label, Icon, glyph, gradient, iconDark, selected, onToggle }: Props) {
  const iconColor = iconDark ? "rgba(15,19,24,0.92)" : "rgba(255,255,255,0.98)";
  const iconDropShadow = iconDark
    ? "drop-shadow(0 1px 1px rgba(255,255,255,0.45))"
    : "drop-shadow(0 1px 2px rgba(0,0,0,0.35))";
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex flex-col items-center gap-2 w-full cursor-pointer transition-all duration-200 rounded-2xl p-3 text-center"
      style={{
        background: selected ? "rgba(94,196,192,0.08)" : "rgba(255,255,255,0.02)",
        border: `1.5px solid ${selected ? "var(--fq-border-teal)" : "var(--fq-border)"}`,
        boxShadow: selected ? "0 0 20px rgba(94,196,192,0.12), var(--fq-shadow-card)" : "var(--fq-shadow-card)",
        outline: "none",
      }}
    >
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width: 58,
          height: 58,
          borderRadius: 13,
          background: gradient,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.55),
            inset 0 -1px 0 rgba(0,0,0,0.12),
            0 6px 16px rgba(0,0,0,0.35),
            0 1px 0 rgba(255,255,255,0.2)
          `,
          border: "1px solid rgba(255,255,255,0.45)",
        }}
      >
        {/* Glass veil */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(165deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.08) 38%, rgba(255,255,255,0) 52%)",
            borderRadius: 13,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 50%)",
            borderRadius: 13,
          }}
        />
        {Icon ? (
          <Icon
            size={ICON_SIZE}
            strokeWidth={1.65}
            className="relative z-[1]"
            style={{
              color: iconColor,
              filter: iconDropShadow,
            }}
          />
        ) : (
          <span
            className="relative z-[1] font-display font-bold"
            style={{
              fontSize: 22,
              color: iconColor,
              textShadow: iconDark ? "0 1px 2px rgba(255,255,255,0.4)" : "0 1px 3px rgba(0,0,0,0.45)",
              lineHeight: 1,
            }}
          >
            {glyph}
          </span>
        )}
      </div>
      <span
        className="font-display leading-tight px-0.5"
        style={{
          fontSize: 11,
          letterSpacing: "0.04em",
          color: selected ? "var(--fq-text-primary)" : "var(--fq-text-body)",
        }}
      >
        {label}
      </span>
      <div
        className="relative flex-shrink-0 transition-all duration-200"
        style={{
          width: 36,
          height: 20,
          background: selected ? "rgba(94,196,192,0.22)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${selected ? "var(--fq-border-teal)" : "var(--fq-border)"}`,
          borderRadius: 10,
        }}
        aria-hidden
      >
        <div
          className="absolute rounded-full transition-all duration-200"
          style={{
            top: 3,
            left: selected ? 18 : 3,
            width: 12,
            height: 12,
            background: selected ? "var(--fq-teal)" : "var(--fq-text-muted)",
            boxShadow: selected ? "0 0 6px rgba(94,196,192,0.5)" : "none",
          }}
        />
      </div>
    </button>
  );
}
