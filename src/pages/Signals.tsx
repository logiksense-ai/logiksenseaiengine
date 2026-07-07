import { mockCompanies } from '../mockData';
import { IconTarget, IconExternalLink } from '@tabler/icons-react';

export const Signals: React.FC = () => {
  const allSignals = mockCompanies.flatMap(c => c.signals.map(s => ({ ...s, companyName: c.name, companyId: c.id })));
  
  return (
    <div>
      <h1 className="text-page-title" style={{ marginBottom: '8px' }}>Global Signal Feed</h1>
      <p className="text-body" style={{ marginBottom: '24px' }}>Real-time stream of verified B2B intent signals processed by the Ruflo Analyst swarm.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {allSignals.map((signal, idx) => (
          <div key={idx} className="card-panel animate-in" style={{ borderLeft: '3px solid var(--color-indigo-600)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-blue">{signal.type}</span>
                  <span className="text-caption" style={{ color: 'var(--text-muted)' }}>{new Date(signal.timestamp).toLocaleString()}</span>
                </div>
                <h3 className="text-company-name" style={{ color: 'var(--color-indigo-300)' }}>
                  {signal.companyName}
                </h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-emerald-600)' }}>+{signal.weight}</div>
                <div className="text-caption">Intent Weight</div>
              </div>
            </div>

            <div className="text-body" style={{ marginBottom: '12px' }}>
              {signal.description}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconTarget size={14} color="var(--text-muted)" />
                <span className="text-caption" style={{ fontStyle: 'italic' }}>Evidence: {signal.evidence}</span>
              </div>
              <a href="#" style={{ color: 'var(--color-indigo-300)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                Source <IconExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
