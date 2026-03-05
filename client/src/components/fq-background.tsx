export default function FQBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Deep space base */}
      <div className="absolute inset-0" style={{ background: '#0f1318' }} />

      {/* Atmospheric gradients — moonlit sky */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(40,70,110,0.14) 0%, transparent 65%),
            radial-gradient(ellipse 50% 60% at 80% 70%, rgba(30,60,90,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 70% 40% at 50% 0%, rgba(80,130,180,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 50% 100%, rgba(20,45,70,0.16) 0%, transparent 50%)
          `,
        }}
      />

      {/* Subtle teal lunar glow top-right */}
      <div
        className="absolute"
        style={{
          top: '-100px',
          right: '-60px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(94,196,192,0.05) 0%, transparent 70%)',
        }}
      />

      {/* XP warm gold glimmer bottom */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '300px',
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(212,168,75,0.03) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
