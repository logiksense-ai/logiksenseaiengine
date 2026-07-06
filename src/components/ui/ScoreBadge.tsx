import React from 'react';

type Tier = 'cold' | 'warm' | 'high' | 'immediate';

const tierStyles = {
  cold:      { bg: 'var(--color-indigo-950)', border: 'var(--color-indigo-600)', text: 'var(--color-indigo-300)' },
  warm:      { bg: 'var(--color-amber-950)', border: 'var(--color-amber-700)', text: 'var(--color-amber-300)' },
  high:      { bg: 'var(--color-blue-950)', border: 'var(--color-blue-700)', text: 'var(--color-blue-300)' },
  immediate: { bg: 'var(--color-red-950)', border: 'var(--color-red-700)', text: 'var(--color-red-300)' },
};

interface ScoreBadgeProps {
  score: number;
  tier: Tier;
  label?: string;
  size?: 'sm' | 'lg';
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, tier, label, size = 'sm' }) => {
  const styles = tierStyles[tier];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        color: styles.text,
        padding: size === 'sm' ? '2px 6px' : '4px 12px',
        borderRadius: '4px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span className={size === 'lg' ? 'text-score' : 'text-body tabular-nums'}>{score}</span>
      </div>
      {label && <span className="text-caption" style={{ color: styles.text }}>{label}</span>}
    </div>
  );
};
