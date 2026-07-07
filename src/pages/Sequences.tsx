import type { FC } from 'react';
import { IconMail, IconPlus, IconDeviceDesktopAnalytics } from '@tabler/icons-react';

export const Sequences: FC = () => {
  return (
    <div className="page-container" style={{ padding: '30px' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Email Sequences</h1>
          <p style={{ color: 'var(--text-muted)' }}>Multi-step autonomous outreach campaigns.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconPlus size={18} /> New Sequence
        </button>
      </header>
      
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <IconMail size={48} style={{ color: 'var(--text-disabled)', marginBottom: '16px' }} />
        <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>No active sequences</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
          Ported from LogikSense Marketing. Start by creating a new automated sequence to engage your leads.
        </p>
      </div>
    </div>
  );
};