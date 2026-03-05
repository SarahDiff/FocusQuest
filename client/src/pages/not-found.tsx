import { useLocation } from "wouter";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <span className="font-display text-5xl block mb-6" style={{ color: 'var(--fq-text-ghost)' }}>◎</span>
      <p
        className="font-display uppercase mb-2"
        style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-teal)', opacity: 0.75 }}
      >
        Lost in the realm
      </p>
      <h1
        className="font-display font-bold mb-4"
        style={{ fontSize: 24, color: 'var(--fq-text-primary)', letterSpacing: '0.04em' }}
      >
        Page Not Found
      </h1>
      <p
        className="font-serif italic mb-8"
        style={{ fontSize: 15, color: 'var(--fq-text-muted)', maxWidth: 260, lineHeight: 1.6 }}
      >
        The path you seek does not exist in this realm.
      </p>
      <button
        onClick={() => navigate('/')}
        className="font-display tracking-[0.14em] uppercase cursor-pointer transition-all duration-200"
        style={{
          background: 'linear-gradient(135deg, rgba(30,55,70,0.9) 0%, rgba(18,38,50,0.95) 100%)',
          border: '1.5px solid var(--fq-border-teal)',
          color: 'var(--fq-teal-bright)',
          borderRadius: 999,
          padding: '13px 32px',
          fontSize: 11,
          boxShadow: '0 0 20px rgba(94,196,192,0.18)',
        }}
      >
        Return Home
      </button>
    </div>
  );
}
