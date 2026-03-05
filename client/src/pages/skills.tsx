import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useFQ } from "@/lib/fq-context";
import {
  SKILLS_LIBRARY, CATEGORY_LABELS, getSkillLevel, getSkillXPProgress,
  formatDuration, type SkillCategory,
} from "@/lib/fq-data";
import XPBar from "@/components/xp-bar";
import SkillIcon from "@/components/skill-icon";

type Tab = 'active' | 'all';

const CATEGORIES: SkillCategory[] = ['mind', 'body', 'creative', 'social', 'outdoors'];

const CATEGORY_ICONS: Record<SkillCategory, string> = {
  mind: 'Moon',
  body: 'Dumbbell',
  creative: 'Palette',
  social: 'Heart',
  outdoors: 'Leaf',
};

export default function Skills() {
  const { state, toggleSkillActive } = useFQ();
  const [tab, setTab] = useState<Tab>('active');
  const [expandedCategory, setExpandedCategory] = useState<SkillCategory | null>('mind');

  const activeSkills = state.userSkills.filter(s => s.isActive);
  const allSkillIds = new Set(state.userSkills.map(s => s.skillId));
  const activeSkillIds = new Set(activeSkills.map(s => s.skillId));

  return (
    <div className="px-5 pt-10 pb-4">
      {/* Header */}
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
          Skills
        </h1>
      </div>

      {/* Tabs */}
      <div
        className="flex mb-6 rounded-xl p-1"
        style={{ background: 'var(--fq-inset)', border: '1px solid var(--fq-border)' }}
      >
        {(['active', 'all'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 font-display uppercase cursor-pointer transition-all duration-200 rounded-lg py-2.5"
            data-testid={`tab-${t}`}
            style={{
              fontSize: 9,
              letterSpacing: '0.18em',
              background: tab === t ? 'var(--fq-surface)' : 'transparent',
              border: tab === t ? '1px solid var(--fq-border)' : '1px solid transparent',
              color: tab === t ? 'var(--fq-text-primary)' : 'var(--fq-text-muted)',
              boxShadow: tab === t ? 'var(--fq-shadow-card)' : 'none',
            }}
          >
            {t === 'active' ? 'Active Skills' : 'All Skills'}
          </button>
        ))}
      </div>

      {/* Active Tab */}
      {tab === 'active' && (
        <div>
          {activeSkills.length === 0 ? (
            <div className="text-center py-16">
              <span className="font-display text-4xl block mb-4" style={{ color: 'var(--fq-text-ghost)' }}>◎</span>
              <h3 className="font-display font-medium mb-2" style={{ fontSize: 16, color: 'var(--fq-text-body)', letterSpacing: '0.04em' }}>
                No Active Skills
              </h3>
              <p className="font-serif italic" style={{ fontSize: 14, color: 'var(--fq-text-muted)' }}>
                Browse All Skills to add your first path.
              </p>
            </div>
          ) : (
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'var(--fq-frost-subtle)',
                backdropFilter: 'blur(14px)',
                border: '1px solid var(--fq-border)',
                boxShadow: 'var(--fq-shadow-card)',
              }}
            >
              {activeSkills.map((us, i) => {
                const def = SKILLS_LIBRARY.find(s => s.id === us.skillId);
                if (!def) return null;
                const level = getSkillLevel(us.totalMinutes);
                const prog = getSkillXPProgress(us.totalMinutes);
                const isLast = i === activeSkills.length - 1;

                return (
                  <div
                    key={us.skillId}
                    className="flex items-center gap-4 p-4"
                    style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.03)' }}
                    data-testid={`skill-item-${us.skillId}`}
                  >
                    <div
                      className="flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{
                        width: 42, height: 42,
                        background: 'rgba(94,196,192,0.06)',
                        border: '1px solid var(--fq-border)',
                      }}
                    >
                      <SkillIcon iconName={def.icon} size={19} style={{ color: 'var(--fq-teal)' }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-display font-medium"
                            style={{ fontSize: 13, color: 'var(--fq-text-primary)', letterSpacing: '0.04em' }}
                          >
                            {def.name}
                          </span>
                          <span
                            className="font-display uppercase"
                            style={{
                              fontSize: 7, letterSpacing: '0.12em',
                              color: 'var(--fq-teal)',
                              background: 'rgba(94,196,192,0.08)',
                              border: '1px solid rgba(94,196,192,0.2)',
                              borderRadius: 4,
                              padding: '1px 5px',
                            }}
                          >
                            Lvl {level}
                          </span>
                        </div>
                        <span className="font-display" style={{ fontSize: 10, color: 'var(--fq-xp)' }}>
                          {formatDuration(us.totalMinutes)}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-serif italic" style={{ fontSize: 11, color: 'var(--fq-text-muted)' }}>
                            {def.description}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XPBar pct={prog.pct} height={3} className="flex-1" />
                          <span className="font-display" style={{ fontSize: 8, color: 'var(--fq-xp)', letterSpacing: '0.06em', flexShrink: 0 }}>
                            {Math.round(prog.pct)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Hint */}
          <p
            className="font-serif italic text-center mt-6"
            style={{ fontSize: 13, color: 'var(--fq-text-muted)' }}
          >
            More paths unlock as you grow.
          </p>
        </div>
      )}

      {/* All Skills Tab */}
      {tab === 'all' && (
        <div className="space-y-4">
          {CATEGORIES.map(cat => {
            const skillsInCat = SKILLS_LIBRARY.filter(s => s.category === cat);
            const isExpanded = expandedCategory === cat;

            return (
              <div
                key={cat}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'var(--fq-frost-subtle)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid var(--fq-border)',
                  boxShadow: 'var(--fq-shadow-card)',
                }}
              >
                {/* Category header */}
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : cat)}
                  className="w-full flex items-center justify-between p-4 cursor-pointer"
                  data-testid={`category-${cat}`}
                  style={{ background: 'none', border: 'none', outline: 'none' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center rounded-lg"
                      style={{ width: 34, height: 34, background: 'rgba(94,196,192,0.07)', border: '1px solid var(--fq-border)' }}
                    >
                      <SkillIcon iconName={CATEGORY_ICONS[cat]} size={15} style={{ color: 'var(--fq-teal)' }} />
                    </div>
                    <span className="font-display font-semibold" style={{ fontSize: 14, color: 'var(--fq-text-primary)', letterSpacing: '0.04em' }}>
                      {CATEGORY_LABELS[cat]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display" style={{ fontSize: 9, color: 'var(--fq-text-muted)', letterSpacing: '0.1em' }}>
                      {skillsInCat.filter(s => activeSkillIds.has(s.id)).length}/{skillsInCat.length}
                    </span>
                    <span
                      className="font-display"
                      style={{
                        fontSize: 14,
                        color: 'var(--fq-text-muted)',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        display: 'inline-block',
                      }}
                    >
                      ↓
                    </span>
                  </div>
                </button>

                {/* Skill list */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--fq-border)' }}>
                    {skillsInCat.map((def, i) => {
                      const userSkill = state.userSkills.find(s => s.skillId === def.id);
                      const isTracked = allSkillIds.has(def.id);
                      const isActive = activeSkillIds.has(def.id);
                      const level = userSkill ? getSkillLevel(userSkill.totalMinutes) : 0;
                      const isLast = i === skillsInCat.length - 1;

                      return (
                        <div
                          key={def.id}
                          className="flex items-center gap-3 px-4 py-3"
                          style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.03)' }}
                        >
                          <div
                            className="flex items-center justify-center rounded-lg flex-shrink-0"
                            style={{
                              width: 36, height: 36,
                              background: isActive ? 'rgba(94,196,192,0.08)' : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${isActive ? 'rgba(94,196,192,0.25)' : 'var(--fq-border)'}`,
                            }}
                          >
                            <SkillIcon
                              iconName={def.icon}
                              size={16}
                              style={{ color: isActive ? 'var(--fq-teal)' : 'var(--fq-text-muted)' }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className="font-display"
                                style={{ fontSize: 12, color: isActive ? 'var(--fq-text-primary)' : 'var(--fq-text-body)', letterSpacing: '0.04em' }}
                              >
                                {def.name}
                              </span>
                              {level > 0 && (
                                <span
                                  className="font-display uppercase"
                                  style={{ fontSize: 7, letterSpacing: '0.1em', color: 'var(--fq-teal)', background: 'rgba(94,196,192,0.08)', border: '1px solid rgba(94,196,192,0.2)', borderRadius: 4, padding: '1px 5px' }}
                                >
                                  Lvl {level}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => toggleSkillActive(def.id)}
                            className="flex items-center justify-center cursor-pointer transition-all duration-200 rounded-full flex-shrink-0"
                            data-testid={`toggle-skill-${def.id}`}
                            style={{
                              width: 28, height: 28,
                              background: isActive ? 'rgba(94,196,192,0.15)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${isActive ? 'var(--fq-border-teal)' : 'var(--fq-border)'}`,
                              color: isActive ? 'var(--fq-teal)' : 'var(--fq-text-muted)',
                            }}
                          >
                            {isActive ? <Check size={12} /> : <Plus size={12} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
