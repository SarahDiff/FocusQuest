import { useFQ } from "@/lib/fq-context";
import { DISCIPLINE_META, ALL_DISCIPLINES, getSkillLevel, getSkillXPProgress, formatDuration } from "@/lib/fq-data";
import XPBar from "@/components/xp-bar";

export default function Skills() {
  const { state } = useFQ();
  const { userDisciplines } = state;
  const inactiveDisciplines = ALL_DISCIPLINES.filter(
    (id) => !userDisciplines.some((d) => d.disciplineId === id),
  );

  return (
    <div className="px-5 pt-10 pb-28">
      <div className="mb-6">
        <p
          className="font-display uppercase mb-1"
          style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--fq-teal)', opacity: 0.92 }}
        >
          Your Path
        </p>
        <h1
          className="font-display font-bold"
          style={{ fontSize: 26, color: 'var(--fq-text-primary)', letterSpacing: '0.02em' }}
        >
          Disciplines
        </h1>
      </div>

      {userDisciplines.length === 0 ? (
        <div className="text-center py-16">
          <span className="font-display text-4xl block mb-4" style={{ color: 'var(--fq-text-ghost)' }}>◎</span>
          <h3 className="font-display font-medium mb-2" style={{ fontSize: 16, color: 'var(--fq-text-body)', letterSpacing: '0.04em' }}>
            No Paths Yet
          </h3>
          <p className="font-serif italic" style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--fq-text-body)' }}>
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

                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{
                        width: 56, height: 56,
                        background: 'rgba(94,196,192,0.07)',
                        border: '1px solid var(--fq-border-teal)',
                      }}
                    >
                      <span
                        className="font-display"
                        style={{ fontSize: 24, color: 'var(--fq-teal)', textShadow: '0 0 12px rgba(94,196,192,0.4)' }}
                      >
                        {meta.glyph}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className="font-display font-semibold"
                          style={{ fontSize: 18, color: 'var(--fq-text-primary)', letterSpacing: '0.03em' }}
                        >
                          {meta.label}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className="fq-label-sm"
                            style={{
                              color: 'var(--fq-teal)',
                              background: 'rgba(94,196,192,0.1)',
                              border: '1px solid rgba(94,196,192,0.28)',
                              borderRadius: 6,
                              padding: '4px 8px',
                            }}
                          >
                            Lvl {level}
                          </span>
                          <span className="font-display tabular-nums" style={{ fontSize: 14, color: 'var(--fq-xp)' }}>
                            {formatDuration(ud.totalMinutes)}
                          </span>
                        </div>
                      </div>

                      <p className="fq-skill-tagline mb-3">
                        {meta.tagline}
                      </p>

                      <div>
                        <div className="flex justify-between items-baseline gap-2 mb-2">
                          <span className="fq-caption" style={{ color: 'var(--fq-text-muted)' }}>
                            Progress to Level {level + 1}
                          </span>
                          <span className="font-display tabular-nums" style={{ fontSize: 14, fontWeight: 600, color: 'var(--fq-xp-bright)' }}>
                            {Math.round(prog.pct)}%
                          </span>
                        </div>
                        <XPBar pct={prog.pct} height={6} />
                      </div>
                    </div>
                  </div>

                  {ud.totalMinutes === 0 && (
                    <p
                      className="fq-italic mt-4 pt-3"
                      style={{ borderTop: '1px solid var(--fq-border)' }}
                    >
                      {meta.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {inactiveDisciplines.length > 0 && (
            <>
              <div className="flex items-center gap-3 mt-6 mb-3">
                <div className="flex-1 h-px" style={{ background: 'var(--fq-border)' }} />
                <span
                  className="fq-label-sm"
                >
                  More Paths
                </span>
                <div className="flex-1 h-px" style={{ background: 'var(--fq-border)' }} />
              </div>
              <div className="space-y-2">
                {inactiveDisciplines.map((id) => {
                  const meta = DISCIPLINE_META[id];
                  return (
                    <div
                      key={id}
                      className="rounded-2xl flex items-center gap-4"
                      data-testid={`discipline-inactive-${id}`}
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--fq-border-mid)',
                        padding: '14px 16px',
                        opacity: 0.88,
                      }}
                    >
                      <div
                        className="flex items-center justify-center rounded-xl flex-shrink-0"
                        style={{
                          width: 44,
                          height: 44,
                          background: 'rgba(15,19,24,0.8)',
                          border: '1px solid var(--fq-border)',
                        }}
                      >
                        <span className="font-display text-lg" style={{ color: 'var(--fq-text-muted)' }}>
                          {meta.glyph}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className="font-display truncate font-semibold"
                            style={{ fontSize: 16, color: 'var(--fq-text-primary)', letterSpacing: '0.03em' }}
                          >
                            {meta.label}
                          </span>
                          <span
                            className="fq-label-sm flex-shrink-0"
                            style={{ color: 'var(--fq-text-muted)' }}
                          >
                            Inactive
                          </span>
                        </div>
                        <p className="fq-skill-tagline-compact line-clamp-2">
                          {meta.tagline}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      <p
        className="font-serif italic text-center mt-8"
        style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--fq-text-body)' }}
      >
        More paths unlock as you grow.
      </p>
    </div>
  );
}
