import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { IconPlus, IconUser, IconMail, IconArrowRight } from '@tabler/icons-react';

export const Pipeline: FC = () => {
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPipeline = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/pipeline`);
      const data = await res.json();
      setColumns(data.columns);
    } catch (err) {
      console.error("Failed to fetch pipeline", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);
  
  return (
    <div className="page-container" style={{ padding: '30px' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Sales Pipeline</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track your leads from initial discovery to conversion.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconPlus size={18} /> Add Deal
        </button>
      </header>
      
      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
        {loading ? (
          <div style={{ color: 'var(--text-muted)', padding: '20px' }}>Loading pipeline...</div>
        ) : (
          columns.map(col => (
            <div key={col.stage} style={{ minWidth: '300px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', padding: '0 5px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {col.stage.replace('_', ' ')}
                </span>
                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                  {col.count}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px', 
                minHeight: '600px', 
                background: 'rgba(0,0,0,0.15)', 
                padding: '12px', 
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                {col.leads.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-disabled)', fontSize: '13px', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    No leads in this stage
                  </div>
                ) : (
                  col.leads.map((lead: any) => (
                    <div key={lead.id} className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', transition: '0.2s' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <div style={{ width: '32px', height: '32px', background: 'var(--color-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>
                            {lead.first_name?.[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '14px' }}>{lead.first_name} {lead.last_name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lead.company_name}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: lead.lead_score > 70 ? 'var(--color-emerald-500)' : 'var(--text-muted)' }}>
                          {lead.lead_score}%
                        </div>
                      </div>
                      
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <IconMail size={12} />
                        {lead.email}
                      </div>

                      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600 }}>
                          Details <IconArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};