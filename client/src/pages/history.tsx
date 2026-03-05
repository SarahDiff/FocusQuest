import { useFQ } from "@/lib/fq-context";
import { SKILLS_LIBRARY, formatDuration, getSkillLevel } from "@/lib/fq-data";
import SkillIcon from "@/components/skill-icon";

function StatsRow() {
  const { state } = useFQ();
  const sessions = state.sessions;
  const totalMinutes = sessions.reduce((s, sess) => s + sess.durationMinutes, 0);
  const thisMonthSessions = sessions.filter(s => {
    const d = new Date(s.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  // Consecutive days streak
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayStr = d.toDateString();
    if (sessions.some(s => new Date(s.date).toDateString() === dayStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  const stats = [
    { label: 'Total Focus', value: formatDuration(totalMinutes) },
    { label: 'This Month', value: `${thisMonthSessions.length} sessions` },
    { label: 'Day Streak', value: `${streak} day${streak !== 1 ? 's' : ''}` },
  ];

  return (
    <div
      className="grid grid-cols-3 gap-3 mb-6"
    >
      {stats.map(s => (
        <div
          key={s.label}
          className="rounded-2xl p-4 text-center"
          style={{
            background: 'var(--fq-frost-subtle)',
            backdropFilter: 'blur(14px)',
            border: '1px solid var(--fq-border)',
            boxShadow: 'var(--fq-shadow-card)',
          }}
        >
          <div
            className="font-display font-semibold mb-1"
            style={{ fontSize: 15, color: 'var(--fq-xp-bright)', textShadow: '0 0 12px rgba(212,168,75,0.3)' }}
          >
            {s.value}
          </div>
          <div
            className="font-display uppercase"
            style={{ fontSize: 7, letterSpacing: '0.14em', color: 'var(--fq-text-muted)' }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function Heatmap() {
  const { state } = useFQ();
  const sessions = state.sessions;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay(); // 0 = Sun

  const daysInMonth = lastDay.getDate();

  const sessionsByDay: Record<number, number> = {};
  sessions.forEach(s => {
    const d = new Date(s.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      sessionsByDay[day] = (sessionsByDay[day] || 0) + s.durationMinutes;
    }
  });

  const maxMin = Math.max(...Object.values(sessionsByDay), 1);

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div
      className="rounded-2xl p-5 mb-6"
      style={{
        background: 'var(--fq-frost-subtle)',
        backdropFilter: 'blur(14px)',
        border: '1px solid var(--fq-border)',
        boxShadow: 'var(--fq-shadow-card)',
      }}
    >
      <div className="flex justify-between items-baseline mb-4">
        <p className="font-display uppercase" style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-text-muted)' }}>
          {today.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
        </p>
        <p className="font-serif italic" style={{ fontSize: 12, color: 'var(--fq-text-muted)' }}>
          Shaded by intensity
        </p>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayLabels.map((l, i) => (
          <div key={i} className="text-center font-display" style={{ fontSize: 7, letterSpacing: '0.08em', color: 'var(--fq-text-muted)' }}>
            {l}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: startOffset }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const mins = sessionsByDay[day] || 0;
          const isToday = day === today.getDate();
          const intensity = mins > 0 ? Math.max(0.15, mins / maxMin) : 0;

          return (
            <div
              key={day}
              className="aspect-square rounded-md flex items-center justify-center"
              title={mins > 0 ? `${day}: ${formatDuration(mins)}` : String(day)}
              style={{
                background: mins > 0
                  ? `rgba(94,196,192,${intensity * 0.35})`
                  : 'rgba(255,255,255,0.03)',
                border: isToday
                  ? '1.5px solid var(--fq-teal)'
                  : mins > 0
                    ? '1px solid rgba(94,196,192,0.2)'
                    : '1px solid transparent',
                boxShadow: isToday ? '0 0 6px rgba(94,196,192,0.3)' : 'none',
              }}
            >
              <span
                className="font-display"
                style={{
                  fontSize: 8,
                  color: isToday ? 'var(--fq-teal)' : mins > 0 ? 'var(--fq-text-body)' : 'var(--fq-text-muted)',
                  letterSpacing: '0.04em',
                }}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function History() {
  const { state } = useFQ();
  const sessions = state.sessions;

  return (
    <div className="px-5 pt-10 pb-4">
      {/* Header */}
      <div className="mb-6">
        <p
          className="font-display uppercase mb-1"
          style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-teal)', opacity: 0.8 }}
        >
          Your Journey
        </p>
        <h1
          className="font-display font-bold"
          style={{ fontSize: 24, color: 'var(--fq-text-primary)', letterSpacing: '0.02em' }}
        >
          History
        </h1>
      </div>

      {/* Stats */}
      <StatsRow />

      {/* Heatmap */}
      <Heatmap />

      {/* Session Log */}
      <div className="mb-4">
        <p
          className="font-display uppercase mb-4"
          style={{ fontSize: 9, letterSpacing: '0.26em', color: 'var(--fq-text-muted)' }}
        >
          Session Log
        </p>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <span className="font-display text-4xl block mb-4" style={{ color: 'var(--fq-text-ghost)' }}>◎</span>
            <h3 className="font-display font-medium mb-2" style={{ fontSize: 16, color: 'var(--fq-text-body)', letterSpacing: '0.04em' }}>
              No Sessions Yet
            </h3>
            <p className="font-serif italic" style={{ fontSize: 14, color: 'var(--fq-text-muted)' }}>
              Begin a focus session to write your legend.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((sess, i) => {
              const def = SKILLS_LIBRARY.find(s => s.id === sess.skillId);
              const date = new Date(sess.date);
              const dateStr = date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
              const timeStr = date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
              const age = i; // 0 = most recent

              return (
                <div
                  key={sess.id}
                  className="flex items-center gap-3 rounded-2xl"
                  data-testid={`session-log-${i}`}
                  style={{
                    padding: '12px 14px',
                    background: 'var(--fq-surface)',
                    border: '1px solid var(--fq-border)',
                    borderLeft: `2.5px solid ${age === 0 ? 'var(--fq-xp)' : age < 3 ? 'rgba(212,168,75,0.4)' : 'rgba(212,168,75,0.15)'}`,
                    backdropFilter: 'blur(14px)',
                    boxShadow: 'var(--fq-shadow-card)',
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{
                      width: 38, height: 38,
                      background: 'rgba(94,196,192,0.06)',
                      border: '1px solid var(--fq-border)',
                    }}
                  >
                    {def && <SkillIcon iconName={def.icon} size={16} style={{ color: 'var(--fq-teal)' }} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="font-display font-medium truncate"
                        style={{ fontSize: 12, color: 'var(--fq-text-primary)', letterSpacing: '0.04em' }}
                      >
                        {def?.name || sess.skillId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif" style={{ fontSize: 11, color: 'var(--fq-text-muted)' }}>
                        {dateStr} · {timeStr}
                      </span>
                      <span className="font-display" style={{ fontSize: 10, color: 'var(--fq-text-body)' }}>
                        {formatDuration(sess.durationMinutes)}
                      </span>
                    </div>
                  </div>

                  <span
                    className="font-display font-bold flex-shrink-0"
                    style={{ fontSize: 14, color: 'var(--fq-xp-bright)', textShadow: '0 0 10px rgba(212,168,75,0.4)' }}
                  >
                    +{sess.xpEarned}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
