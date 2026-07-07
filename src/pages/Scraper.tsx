import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { 
  IconPlus, 
  IconPlayerPlay, 
  IconSettings, 
  IconTrash,
  IconClock,
  IconWorld,
  IconMapPin
} from '@tabler/icons-react';

interface ScraperProfile {
  id: number;
  name: string;
  business_type: string;
  city: string | null;
  country: string | null;
  query: string;
  target_limit: number;
  is_active: boolean;
  created_at: string;
}

export const Scraper: FC = () => {
  const [profiles, setProfiles] = useState<ScraperProfile[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // New Profile Form State
  const [newProfile, setNewProfile] = useState({
    name: '',
    business_type: '',
    city: '',
    country: '',
    target_limit: 10
  });

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/scraper/profiles`);
      const data = await res.json();
      setProfiles(data);
    } catch (err) {
      console.error('Failed to fetch profiles', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/scraper/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile),
      });
      if (res.ok) {
        setShowNewModal(false);
        fetchProfiles();
        setNewProfile({ name: '', business_type: '', city: '', country: '', target_limit: 10 });
      }
    } catch (err) {
      console.error('Failed to create profile', err);
    }
  };

  const handleRunScraper = async (id: number) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/scraper/profiles/${id}/run`, {
        method: 'POST'
      });
      alert('Scraper job started!');
    } catch (err) {
      console.error('Failed to run scraper', err);
    }
  };

  return (
    <div className="page-container" style={{ padding: '30px', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>
            AI Domain Scraper
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            {loading ? 'Synchronizing profiles...' : `Managing ${profiles.length} autonomous search protocols across global registries.`}
          </p>
        </div>
        <button 
          onClick={() => setShowNewModal(true)}
          className="btn-primary" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 600
          }}
        >
          <IconPlus size={18} />
          Create Profile
        </button>
      </header>

      <div className="glass-panel" style={{ padding: '24px', marginBottom: '30px' }}>
        {loading && profiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="pulse-green" style={{ width: '20px', height: '20px', margin: '0 auto 16px' }}></div>
            Loading Search Protocols...
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '13px' }}>
                <th style={{ padding: '12px' }}>PROFILE NAME</th>
                <th style={{ padding: '12px' }}>TARGETING</th>
                <th style={{ padding: '12px' }}>LIMIT</th>
                <th style={{ padding: '12px' }}>STATUS</th>
                <th style={{ padding: '12px' }}>CREATED</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map(profile => (
                <tr key={profile.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '14px' }} className="table-row-hover">
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 600 }}>{profile.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{profile.business_type}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-muted)', fontSize: '13px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconMapPin size={14} /> {profile.city || 'Global'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconWorld size={14} /> {profile.country || 'Any'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>{profile.target_limit} leads</td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      fontWeight: 700, 
                      background: profile.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                      color: profile.is_active ? '#10b981' : 'var(--text-muted)'
                    }}>
                      {profile.is_active ? 'ACTIVE' : 'IDLE'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <IconClock size={14} /> {new Date(profile.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleRunScraper(profile.id)} className="icon-btn-small" title="Trigger Scrape"><IconPlayerPlay size={16} /></button>
                      <button className="icon-btn-small"><IconSettings size={16} /></button>
                      <button className="icon-btn-small text-danger"><IconTrash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showNewModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 1000 
        }}>
          <div className="glass-panel" style={{ width: '400px', padding: '24px', background: 'var(--bg-dark)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '20px' }}>Configure Scraper</h2>
            <form onSubmit={handleCreateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Profile Name</label>
                <input 
                  type="text" 
                  value={newProfile.name}
                  onChange={e => setNewProfile({...newProfile, name: e.target.value})}
                  placeholder="e.g. Melbourne Accountants" 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Business Category</label>
                <input 
                  type="text" 
                  value={newProfile.business_type}
                  onChange={e => setNewProfile({...newProfile, business_type: e.target.value})}
                  placeholder="e.g. Plumbers, Lawyers" 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>City</label>
                  <input 
                    type="text" 
                    value={newProfile.city}
                    onChange={e => setNewProfile({...newProfile, city: e.target.value})}
                    placeholder="Melbourne" 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Country Code</label>
                  <input 
                    type="text" 
                    value={newProfile.country}
                    onChange={e => setNewProfile({...newProfile, country: e.target.value})}
                    placeholder="AU" 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowNewModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '6px', fontWeight: 600 }}>Initialize Protocol</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
