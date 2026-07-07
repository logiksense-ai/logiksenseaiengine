import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { LeadsView } from '../components/LeadsView';
import { mockCompanies } from '../mockData';
import { IconUsers, IconTarget, IconActivity } from '@tabler/icons-react';

export const Leads: FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/leads`);
        const data = await res.json();
        setLeads(data);
      } catch (err) {
        console.error("Failed to fetch leads", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-page-title">Lead Intelligence</h1>
          <p style={{ color: 'var(--text-muted)' }}>Autonomous scouting results & verified individuals.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="card-panel" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconUsers size={20} color="var(--color-primary)" />
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.6 }}>Total Leads</div>
              <div style={{ fontWeight: 700 }}>{leads.length}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Grid for People / Companies */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {leads.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1/-1', padding: '60px', textAlign: 'center' }}>
            <IconTarget size={48} style={{ color: 'var(--text-disabled)', marginBottom: '16px' }} />
            <h3>No leads found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Run a scraper job to start identifying high-value leads.</p>
          </div>
        ) : (
          leads.map(lead => (
            <div key={lead.id} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {lead.first_name?.[0]}
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>{lead.first_name} {lead.last_name}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lead.job_title} at {lead.company_name}</span>
                  </div>
                </div>
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                  {lead.lead_score}%
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <IconActivity size={14} />
                  <span>Status: {lead.status}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-primary" style={{ flex: 1, fontSize: '12px', padding: '8px' }}>View Details</button>
                <button className="btn-secondary" style={{ flex: 1, fontSize: '12px', padding: '8px' }}>Enroll Sequence</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Company-Level Intent</h2>
        <LeadsView companies={mockCompanies} />
      </div>
    </div>
  );
};
