import { useFQ } from "@/lib/fq-context";
import { DISCIPLINE_META, getSkillLevel, getSkillXPProgress, formatDuration } from "@/lib/fq-data";
import XPBar from "@/components/xp-bar";

export default function Skills() {
  const { state } = useFQ();
  const { userDisciplines } = state;

  return (
    <div className="px-5 pt-10 pb-28">
      <div className="mb-6">
        <p
          className="font-display uppercase mb-1"
          style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-teal)', opacity: 0.8 }}
        >
          Your Path
        </p>
        <h1
          className="font-display font-bold"
          style={{ fontSize: 24, color: 'var(--fq-text-primary)', letterSpacing: '0.02em' }}
        >
          Disciplines
        </h1>
      </div>

      {userDisciplines.length === 0 ? (
        <div className="text-center py-16">
          <span className="font-display text-4xl block mb-4" style={{ color: 'var(--fq-text-ghost)' }}>◎</span>
          <h3 className="font-display font-medium mb-2" style={{ fontSize: 16, color: 'var(--fq-text-body)', letterSpacing: '0.04em' }}>
            No Disciplines Yet
          </h3>
          <p className="font-serif italic" style={{ fontSize: 14, color: 'var(--fq-text-muted)' }}>
            Complete onboarding to begin your path.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {userDisciplines.map(ud => {
            const meta = DISCIPLINE_META[ud.disciplineId];
            const level = getSkillLevel(ud.totalMinutes);
            const prog = getSkillXPProgress(ud.totalMinutes);

            return (
              <div
                key={ud.disciplineId}
                className="rounded-2xl relative overflow-hidden"
                data-testid={`discipline-card-${ud.disciplineId}`}
                style={{
                  background: 'var(--fq-frost-subtle)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid var(--fq-border)',
                  boxShadow: 'var(--fq-shadow-card)',
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0"
                  style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(94,196,192,0.2) 50%, transparent)' }}
                />

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{
                        width: 52, height: 52,
                        background: 'rgba(94,196,192,0.07)',
                        border: '1px solid var(--fq-border-teal)',
                      }}
                    >
                      <span
                        className="font-display"
                        style={{ fontSize: 22, color: 'var(--fq-teal)', textShadow: '0 0 12px rgba(94,196,192,0.4)' }}
                      >
                        {meta.glyph}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span
                          className="font-display font-semibold"
                          style={{ fontSize: 15, color: 'var(--fq-text-primary)', letterSpacing: '0.04em' }}
                        >
                          {meta.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className="font-display uppercase"
                            style={{
                              fontSize: 7, letterSpacing: '0.12em',
                              color: 'var(--fq-teal)',
                              background: 'rgba(94,196,192,0.08)',
                              border: '1px solid rgba(94,196,192,0.2)',
                              borderRadius: 4,
                              padding: '2px 6px',
                            }}
                          >
                            Lvl {level}
                          </span>
                          <span className="font-display" style={{ fontSize: 10, color: 'var(--fq-xp)' }}>
                            {formatDuration(ud.totalMinutes)}
                          </span>
                        </div>
                      </div>

                      <p
                        className="font-display uppercase mb-3"
                        style={{ fontSize: 7, letterSpacing: '0.14em', color: 'var(--fq-text-muted)', opacity: 0.85 }}
                      >
                        {meta.tagline}
                      </p>

                      <div>
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="font-display uppercase" style={{ fontSize: 7, letterSpacing: '0.14em', color: 'var(--fq-text-muted)' }}>
                            Progress to Level {level + 1}
                          </span>
                          <span className="font-display" style={{ fontSize: 8, color: 'var(--fq-xp-bright)' }}>
                            {Math.round(prog.pct)}%
                          </span>
                        </div>
                        <XPBar pct={prog.pct} height={4} />
                      </div>
                    </div>
                  </div>

                  {ud.totalMinutes === 0 && (
                    <p
                      className="font-serif italic mt-3"
                      style={{ fontSize: 12, color: 'var(--fq-text-muted)' }}
                    >
                      {meta.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p
        className="font-serif italic text-center mt-8"
        style={{ fontSize: 13, color: 'var(--fq-text-muted)' }}
      >
        More paths unlock as you grow.
      </p>
    </div>
  );
}
