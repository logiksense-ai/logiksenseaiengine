import type { FC } from 'react';
import { IconShieldCheck, IconAlertTriangle } from '@tabler/icons-react';

export const Compliance: FC = () => {
  return (
    <div className="page-container" style={{ padding: '30px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Governance & Compliance</h1>
        <p style={{ color: 'var(--text-muted)' }}>AI safety, data privacy, and sender reputation monitoring.</p>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '8px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '8px' }}>
              <IconShieldCheck size={24} />
            </div>
            <h3 style={{ margin: 0 }}>Sender Reputation</h3>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>All connected domains are currently in good standing.</p>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
            <div style={{ width: '95%', height: '100%', background: '#22c55e', borderRadius: '2px' }}></div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '8px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', borderRadius: '8px' }}>
              <IconAlertTriangle size={24} />
            </div>
            <h3 style={{ margin: 0 }}>AI Safety Guardrails</h3>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>24 potential hallucinations blocked in the last 7 days.</p>
          <button className="btn-secondary" style={{ width: '100%' }}>Review Logs</button>
        </div>
      </div>
    </div>
  );
};