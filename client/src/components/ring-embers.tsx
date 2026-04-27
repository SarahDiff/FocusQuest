/**
 * Full-page golden embers during an active focus session.
 * Same style as onboarding (ember-particles.tsx) but only on session page.
 */
const RING_EMBERS = Array.from({ length: 24 }, (_, i) => {
  const seed = i * 137.508;
  const rand = (min: number, max: number, offset = 0) =>
    min + ((Math.sin(seed + offset) * 0.5 + 0.5) * (max - min));
  return {
    id: i,
    left: rand(1, 99, 0),
    size: rand(1.5, 3.6, 1),
    duration: rand(4.2, 8.5, 2),
    delay: rand(-8, 0, 3),
    drift: (rand(0, 1, 4) > 0.5 ? 1 : -1) * rand(12, 44, 5),
    color: rand(0, 1, 6) > 0.55 ? '#ecc96a' : '#d4a84b',
    blur: rand(0, 1, 7) > 0.65 ? 1.5 : 0,
  };
});

export default function RingEmbers() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {RING_EMBERS.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            bottom: 0,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            filter: p.blur ? `blur(${p.blur}px)` : undefined,
            boxShadow: `0 0 ${p.size * 2.5}px ${p.color}, 0 0 ${p.size}px rgba(255,200,80,0.6)`,
            animation: `ember-rise ${p.duration}s ease-out ${p.delay}s infinite`,
            ['--ember-drift' as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
