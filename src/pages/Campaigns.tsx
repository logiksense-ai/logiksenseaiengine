import React from 'react';
import { 
  IconMail, 
  IconPlayerPlay, 
  IconChartBar, 
  IconUsers,
  IconClock,
  IconDots
} from '@tabler/icons-react';

export const Campaigns: React.FC = () => {
  const campaigns = [
    { id: 1, name: 'Q3 Enterprise Outreach', status: 'Running', sent: 142, openRate: '68%', leads: 42 },
    { id: 2, name: 'SMB Automated Followup', status: 'Paused', sent: 89, openRate: '41%', leads: 12 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease-out' }}>
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-page-title">Email Campaigns</h1>
          <p className="text-body" style={{ color: 'var(--text-muted)' }}>Managed sequences for verified intent leads.</p>
        </div>
        <button className="button-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconMail size={18} /> Create Campaign
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="card-panel">
          <div className="text-supporting">Total Sent</div>
          <div className="text-stat">4,812</div>
          <div className="text-caption" style={{ color: 'var(--color-emerald-600)' }}>Avg Open Rate: 52%</div>
        </div>
        <div className="card-panel">
          <div className="text-supporting">Active Sequences</div>
          <div className="text-stat">8</div>
          <div className="text-caption">3 awaiting approval</div>
        </div>
        <div className="card-panel">
          <div className="text-supporting">Conversions</div>
          <div className="text-stat">24</div>
          <div className="text-caption" style={{ color: 'var(--color-indigo-300)' }}>8 from Marketist signals</div>
        </div>
      </div>

      <div className="card-panel">
        <h3 className="text-section-header">Active Sequences</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Status</th>
              <th>Sent</th>
              <th>Open Rate</th>
              <th>Leads</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div className="text-caption">Modified 2d ago</div>
                </td>
                <td>
                  <span className={`badge ${c.status === 'Running' ? 'badge-green' : 'badge-amber'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="tabular-nums">{c.sent}</td>
                <td className="tabular-nums">{c.openRate}</td>
                <td className="tabular-nums">{c.leads}</td>
                <td style={{ textAlign: 'right' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <IconDots size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
