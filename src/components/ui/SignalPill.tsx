interface SignalPillProps {
  icon: React.ReactNode;
  label: string;
  recency: string;
}

export const SignalPill: React.FC<SignalPillProps> = ({ icon, label, recency }) => {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 8px',
      backgroundColor: 'var(--bg-panel)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '4px',
    }}>
      <span style={{ color: 'var(--text-muted)', display: 'flex' }}>{icon}</span>
      <span className="text-caption" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ color: 'var(--text-disabled)', fontSize: '11px' }}>·</span>
      <span className="text-caption tabular-nums" style={{ color: 'var(--text-muted)' }}>{recency}</span>
    </div>
  );
};
