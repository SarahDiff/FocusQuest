interface XPBarProps {
  pct: number;
  height?: number;
  showShimmer?: boolean;
  color?: 'xp' | 'teal';
  className?: string;
}

export default function XPBar({ pct, height = 4, showShimmer = true, color = 'xp', className = '' }: XPBarProps) {
  const fillStyle = color === 'xp'
    ? {
        background: 'linear-gradient(90deg, #6b4e18, #d4a84b, #ecc96a)',
        boxShadow: '0 0 10px rgba(212,168,75,0.22), 0 0 3px rgba(212,168,75,0.38)',
      }
    : {
        background: 'linear-gradient(90deg, #2a5c5a, #5ec4c0, #7ddbd7)',
        boxShadow: '0 0 10px rgba(94,196,192,0.22), 0 0 3px rgba(94,196,192,0.38)',
      };

  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{
        height: `${height}px`,
        background: 'rgba(255,255,255,0.05)',
      }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
        style={{ width: `${Math.min(pct, 100)}%`, ...fillStyle }}
      >
        {showShimmer && (
          <div
            className="absolute top-0 h-full"
            style={{
              width: '50%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              animation: 'shimmer 3.5s infinite 0.8s',
            }}
          />
        )}
      </div>
    </div>
  );
}
