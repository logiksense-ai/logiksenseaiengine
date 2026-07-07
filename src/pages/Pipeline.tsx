import type { FC } from 'react';
import { IconPlus } from '@tabler/icons-react';

export const Pipeline: FC = () => {
  const columns = ['Interested', 'Meeting Booked', 'Demo Done', 'Negotiation', 'Closed Won'];
  
  return (
    <div className="page-container" style={{ padding: '30px' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Sales Pipeline</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track your deals from interest to close.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconPlus size={18} /> Add Deal
        </button>
      </header>
      
      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
        {columns.map(col => (
          <div key={col} style={{ minWidth: '280px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', padding: '0 5px' }}>
              <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)' }}>{col.toUpperCase()}</span>
              <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>0</span>
            </div>
            <div className="glass-panel" style={{ minHeight: '500px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
              {/* Cards go here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};