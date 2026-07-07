import { 
  IconBrandLinkedin, 
  IconUserSearch, 
  IconMessage, 
  IconShieldCheck,
  IconAlertCircle
} from '@tabler/icons-react';

export const LinkedIn: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease-out' }}>
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(10, 102, 194, 0.15) 0%, rgba(0, 0, 0, 0) 100%)' }}>
        <div>
          <h1 className="text-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconBrandLinkedin size={32} color="#0A66C2" /> LinkedIn Automation
          </h1>
          <p className="text-body" style={{ color: 'var(--text-muted)' }}>Autonomous profile research and hyper-personalized outreach.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="button-secondary">Sync Accounts</button>
          <button className="button-primary">New Workflow</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Connection Pulse */}
        <div className="card-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="text-section-header">Browser Session Health</h3>
            <IconShieldCheck color="var(--color-emerald-600)" />
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="text-body">Account: **Bipin (Admin)**</span>
              <span className="badge badge-green">Connected</span>
            </div>
            <div className="text-caption">User Agent: Playwright/Chrome-Headless</div>
            <div className="text-caption">IP: 103.XXX.XXX.XXX (Static Proxy)</div>
          </div>
        </div>

        {/* LinkedIn Signals */}
        <div className="card-panel">
          <h3 className="text-section-header">LinkedIn Specific Signals</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
              <IconUserSearch size={20} color="var(--color-indigo-300)" />
              <div>
                <div className="text-body" style={{ fontWeight: 600 }}>Decison Maker found for Apex Finance</div>
                <div className="text-caption">Sarah Jenkins (VP Finance) matched LinkedIn Profile</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
              <IconAlertCircle size={20} color="var(--color-amber-600)" />
              <div>
                <div className="text-body" style={{ fontWeight: 600 }}>Prospect changed roles</div>
                <div className="text-caption">Marcus Sterling recently moved to Tech Lead SRE</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-panel">
        <h3 className="text-section-header">Pending Outreach Queue</h3>
        <p className="text-body" style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>AI-generated connection requests awaiting your approval.</p>
        
        <div style={{ display: 'grid', gap: '12px' }}>
          {[1, 2].map(i => (
            <div key={i} style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconMessage size={20} />
                </div>
                <div>
                  <div className="text-body" style={{ fontWeight: 600 }}>To: Sarah Jenkins · Apex Finance</div>
                  <div className="text-caption">"Hi Sarah, saw your post about ERP migration. We recently..."</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="button-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Edit</button>
                <button className="button-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Send Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
