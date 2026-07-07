import type { FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import { LeadsView } from '../components/LeadsView';
import { mockCompanies } from '../mockData';
import { IconUsers, IconTarget, IconActivity, IconUpload, IconFileSpreadsheet, IconCheck, IconLoader2, IconX } from '@tabler/icons-react';

export const Leads: FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any>(null);
  const [importMapping, setImportMapping] = useState<any>({});
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/leads`);
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/leads/import/preview`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setImportPreview(data);
      
      // Auto-map based on similar names
      const mapping: any = {};
      const cols = data.detectedColumns;
      const findCol = (terms: string[]) => cols.find((c: string) => terms.some(t => c.toLowerCase().includes(t)));
      
      mapping.email = findCol(['email', 'mail']);
      mapping.first_name = findCol(['first', 'given', 'fname']);
      mapping.last_name = findCol(['last', 'surname', 'lname']);
      mapping.company_name = findCol(['company', 'org', 'business']);
      mapping.job_title = findCol(['title', 'job', 'position', 'role']);
      mapping.linkedin_url = findCol(['linkedin', 'social', 'url']);
      
      setImportMapping(mapping);
    } catch (err) {
      alert("Failed to preview file");
    }
  };

  const onConfirmImport = async () => {
    if (!file) return;
    setImporting(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mapping', JSON.stringify(importMapping));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/leads/import/confirm`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert(`Successfully imported ${data.imported} leads!`);
        setImportModalOpen(false);
        setFile(null);
        setImportPreview(null);
        fetchLeads();
      }
    } catch (err) {
      alert("Import failed");
    } finally {
      setImporting(false);
    }
  };

  const IMPORT_FIELDS = [
    { key: 'email', label: 'Email Address *' },
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'company_name', label: 'Company' },
    { key: 'job_title', label: 'Job Title' },
    { key: 'linkedin_url', label: 'LinkedIn URL' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
      <header className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-page-title">Lead Intelligence</h1>
          <p style={{ color: 'var(--text-muted)' }}>Autonomous scouting results & verified individuals.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setImportModalOpen(true)}
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}
          >
            <IconUpload size={18} />
            Import CSV
          </button>
          <div className="card-panel" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconUsers size={20} color="var(--color-primary)" />
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.6 }}>Total Leads</div>
              <div style={{ fontWeight: 700 }}>{leads.length}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', zIndex: 1000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="glass-panel" style={{ width: '600px', padding: '32px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button 
              onClick={() => setImportModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <IconX size={24} />
            </button>
            <h2 style={{ marginBottom: '8px' }}>Import Leads</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>Upload a CSV or Excel file to populate your campaign targets.</p>

            {!importPreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '16px', padding: '60px', textAlign: 'center', cursor: 'pointer', transition: '0.2s', background: 'rgba(255,255,255,0.02)' }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              >
                <IconFileSpreadsheet size={48} color="var(--color-primary)" style={{ marginBottom: '16px' }} />
                <h3>Drop file here or click to browse</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-disabled)', marginTop: '8px' }}>Supports .csv, .xls, .xlsx</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv,.xlsx,.xls" style={{ display: 'none' }} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', color: '#22c55e', fontSize: '14px' }}>
                  <IconCheck size={18} />
                  <span>Success: Detected {importPreview.totalRows} leads and {importPreview.detectedColumns.length} columns.</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Column Mapping</h4>
                  {IMPORT_FIELDS.map(field => (
                    <div key={field.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '10px' }}>
                      <span style={{ fontSize: '14px' }}>{field.label}</span>
                      <select 
                        value={importMapping[field.key] || ''}
                        onChange={(e) => setImportMapping({...importMapping, [field.key]: e.target.value})}
                        style={{ background: '#1e1b4b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', width: '200px' }}
                      >
                        <option value="">Do not import</option>
                        {importPreview.detectedColumns.map((col: string) => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={onConfirmImport}
                  disabled={importing || !importMapping.email}
                  className="btn-primary" 
                  style={{ marginTop: '12px', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                  {importing ? <IconLoader2 className="animate-spin" size={20} /> : <IconUpload size={20} />}
                  Confirm & Start Import
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
