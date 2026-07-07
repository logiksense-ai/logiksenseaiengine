import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { 
  IconDots,
  IconPlus,
  IconClock,
  IconExternalLink
} from '@tabler/icons-react';

export const Campaigns: FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [sequences, setSequences] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  // Modal states
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSequenceModalOpen, setIsSequenceModalOpen] = useState(false);

  // Form states
  const [newTemplate, setNewTemplate] = useState({ name: '', subject: '', body: '' });

  const fetchData = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const [tempRes, seqRes] = await Promise.all([
        fetch(`${baseUrl}/api/email/templates`),
        fetch(`${baseUrl}/api/email/sequences`)
      ]);
      setTemplates(await tempRes.json());
      setSequences(await seqRes.json());
    } catch (err) {
      console.error("Failed to fetch campaign data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/email/templates?name=${encodeURIComponent(newTemplate.name)}&subject=${encodeURIComponent(newTemplate.subject)}&body=${encodeURIComponent(newTemplate.body)}`, {
        method: 'POST'
      });
      if (res.ok) {
        setIsTemplateModalOpen(false);
        setNewTemplate({ name: '', subject: '', body: '' });
        fetchData();
      }
    } catch (err) {
      console.error("Failed to create template", err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease-out', position: 'relative' }}>
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-page-title">Digital Marketing Hub</h1>
          <p className="text-body" style={{ color: 'var(--text-muted)' }}>Managed sequences for verified intent leads.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button 
            onClick={() => setIsTemplateModalOpen(true)}
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <IconPlus size={18} /> New Template
          </button>
          <button 
            onClick={() => setIsSequenceModalOpen(true)}
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <IconPlus size={18} /> New Sequence
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        
        {/* Sequences Section */}
        <div className="card-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="text-section-header">Active Sequences</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sequences.length} Active</span>
          </div>
          
          {sequences.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
              <IconClock size={32} style={{ color: 'var(--text-disabled)', marginBottom: '12px' }} />
              <p style={{ color: 'var(--text-muted)' }}>No active sequences. Create one to start outreach.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sequence Name</th>
                  <th>Status</th>
                  <th>Steps</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sequences.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                      <div className="text-caption">{s.description}</div>
                    </td>
                    <td><span className="badge badge-green">Active</span></td>
                    <td>{s.steps?.length || 0} Steps</td>
                    <td style={{ textAlign: 'right' }}>
                      <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                        <IconDots size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Templates Section */}
        <div className="card-panel">
          <h3 className="text-section-header" style={{ marginBottom: '20px' }}>Content Templates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {templates.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No templates saved yet.</p>
            ) : (
              templates.map(t => (
                <div key={t.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{t.name}</span>
                    <IconExternalLink size={14} style={{ cursor: 'pointer', opacity: 0.5 }} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Sub: {t.subject}</div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Template Modal */}
      {isTemplateModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '500px', padding: '24px' }}>
            <h2 className="text-section-header">Create New Template</h2>
            <form onSubmit={handleCreateTemplate} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <input 
                type="text" 
                placeholder="Template Name" 
                className="input-field"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                required
              />
              <input 
                type="text" 
                placeholder="Subject" 
                className="input-field"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                value={newTemplate.subject}
                onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                required
              />
              <textarea 
                placeholder="Body" 
                className="input-field"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', minHeight: '150px' }}
                value={newTemplate.body}
                onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                required
              ></textarea>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsTemplateModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Template</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sequence Modal (Placeholder) */}
      {isSequenceModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '500px', padding: '24px', textAlign: 'center' }}>
            <h2 className="text-section-header">Sequence Builder</h2>
            <p style={{ color: 'var(--text-muted)', margin: '16px 0' }}>Multi-step sequence builder is currently in read-only mode while we migrate the orchestration engine.</p>
            <button onClick={() => setIsSequenceModalOpen(false)} className="btn-primary">Understood</button>
          </div>
        </div>
      )}
    </div>
  );
};
