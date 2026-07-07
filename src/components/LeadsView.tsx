import { useState } from 'react';
import type { Company } from '../types';
import { Search, ChevronRight, X, Sparkles, ShieldCheck, Users } from 'lucide-react';

interface LeadsViewProps {
  companies: Company[];
}

export const LeadsView = ({ companies }: LeadsViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [drawerTab, setDrawerTab] = useState<'info' | 'meddpicc' | 'committee'>('info');

  const countries = ['All', ...Array.from(new Set(companies.map(c => c.country)))];

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || c.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const getScoreColor = (score: number) => {
    if (score >= 76) return 'var(--color-success)';
    if (score >= 51) return 'var(--color-primary)';
    if (score >= 26) return 'var(--color-warning)';
    return 'var(--color-muted)';
  };

  const getInfluenceColor = (inf: string) => {
    if (inf === 'High') return 'var(--color-success)';
    if (inf === 'Medium') return 'var(--color-secondary)';
    if (inf === 'Negative') return 'var(--color-danger)';
    return 'var(--text-muted)';
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: activeCompany ? '1.1fr 0.9fr' : '1fr', gap: '20px', transition: 'all 0.3s ease-in-out' }}>
      
      {/* Main Grid View */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700 }}>Scored Queue & Deal Intelligence</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Monitoring buying signals, MEDDPICC win probabilities, and ICP grades.
            </p>
          </div>

          {/* Search and Filters */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search name..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ 
                  background: 'rgba(9, 13, 22, 0.6)', 
                  border: '1px solid var(--border-glow)', 
                  color: 'white', 
                  padding: '8px 12px 8px 32px', 
                  borderRadius: '8px', 
                  fontSize: '13px',
                  width: '180px'
                }}
              />
            </div>

            <select 
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              style={{ 
                background: 'rgba(9, 13, 22, 0.6)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                color: 'white', 
                padding: '8px 12px', 
                borderRadius: '8px', 
                fontSize: '13px'
              }}
            >
              {countries.map(cntry => (
                <option key={cntry} value={cntry} style={{ background: '#090d16' }}>{cntry === 'All' ? 'All Countries' : cntry}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Datagrid Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glow)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px' }}>Entity</th>
                <th style={{ padding: '12px 16px' }}>ICP Fit</th>
                <th style={{ padding: '12px 16px' }}>v3 Intent</th>
                <th style={{ padding: '12px 16px' }}>Win Probability</th>
                <th style={{ padding: '12px 16px' }}>Classification</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map(comp => (
                <tr 
                  key={comp.id} 
                  style={{ 
                    borderBottom: '1px solid rgba(255,255,255,0.03)', 
                    cursor: 'pointer',
                    background: activeCompany?.id === comp.id ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => {
                    setActiveCompany(comp);
                    setDrawerTab('info');
                  }}
                >
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 600 }}>{comp.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{comp.domain}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px', 
                      fontWeight: 700,
                      background: comp.icpGrade === 'A' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: comp.icpGrade === 'A' ? 'var(--color-success)' : 'var(--color-warning)'
                    }}>
                      Grade {comp.icpGrade}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ color: getScoreColor(comp.intentScore), fontWeight: 700 }}>
                      {comp.intentScore}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 600, color: 'var(--color-secondary)' }}>
                    {comp.winProbability}%
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      fontSize: '11px', 
                      fontWeight: 600,
                      background: 
                        comp.classification === 'Immediate Opportunity' ? 'rgba(16, 185, 129, 0.15)' :
                        comp.classification === 'High Intent' ? 'rgba(139, 92, 246, 0.15)' :
                        comp.classification === 'Warm' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                      color: 
                        comp.classification === 'Immediate Opportunity' ? 'var(--color-success)' :
                        comp.classification === 'High Intent' ? 'var(--color-primary)' :
                        comp.classification === 'Warm' ? 'var(--color-warning)' : 'var(--text-muted)'
                    }}>
                      {comp.classification}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                      Inspect <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer: Detailed Company Intelligence & Deal Qualification Panel */}
      {activeCompany && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '20px', alignSelf: 'start' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '1px solid var(--border-glow)', paddingBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: 600 }}>
                {activeCompany.targetTier} Tier • ICP GRADE: {activeCompany.icpGrade}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>{activeCompany.name}</h3>
            </div>
            <button 
              onClick={() => setActiveCompany(null)}
              style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Drawer Tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '8px' }}>
            <button 
              onClick={() => setDrawerTab('info')}
              style={{ flex: 1, background: drawerTab === 'info' ? 'var(--color-primary)' : 'none', border: 'none', color: 'white', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
            >
              Intelligence
            </button>
            <button 
              onClick={() => setDrawerTab('meddpicc')}
              style={{ flex: 1, background: drawerTab === 'meddpicc' ? 'var(--color-primary)' : 'none', border: 'none', color: 'white', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}
            >
              <ShieldCheck size={12} /> MEDDPICC
            </button>
            <button 
              onClick={() => setDrawerTab('committee')}
              style={{ flex: 1, background: drawerTab === 'committee' ? 'var(--color-primary)' : 'none', border: 'none', color: 'white', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}
            >
              <Users size={12} /> Committee
            </button>
          </div>

          {/* Tab 1: Intelligence Info */}
          {drawerTab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Win Probability</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-secondary)' }}>{activeCompany.winProbability}%</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Registry Source</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px', color: '#fff' }}>{activeCompany.registrySource}</div>
                </div>
              </div>

              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-secondary)' }}>
                  <Sparkles size={14} /> Agent 9 Opportunity Synthesis
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', background: 'rgba(139, 92, 246, 0.05)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                  <div><strong>Critical Gaps:</strong> {activeCompany.riskSummary}</div>
                  <div><strong>Angle:</strong> {activeCompany.oppSummary}</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: MEDDPICC Scorecard */}
          {drawerTab === 'meddpicc' && activeCompany.meddpicc && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Agent 16 MEDDPICC Audit</h4>
                <span style={{ fontSize: '13px', color: 'var(--color-secondary)', fontWeight: 700 }}>Win Prob: {activeCompany.winProbability}%</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(activeCompany.meddpicc).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', borderLeft: val ? '3px solid var(--color-success)' : '3px solid var(--color-danger)' }}>
                    <span style={{ textTransform: 'capitalize', fontSize: '13px', fontWeight: 500 }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: val ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {val ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Buying Committee Mapping */}
          {drawerTab === 'committee' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Mapped Buying Committee (Agent 16)</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeCompany.committee?.map((member, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{member.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{member.title}</div>
                      <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', color: 'var(--color-secondary)' }}>
                        {member.role}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'end' }}>
                      <span style={{ fontSize: '11px', color: getInfluenceColor(member.influence), fontWeight: 600 }}>
                        {member.influence} Influence
                      </span>
                      <span style={{ 
                        fontSize: '11px', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        background: member.status === 'Blocked' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
                        color: member.status === 'Blocked' ? 'var(--color-danger)' : 'var(--text-muted)'
                      }}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))}
                {(!activeCompany.committee || activeCompany.committee.length === 0) && (
                  <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                    No stakeholders mapped yet. Trigger Agent 16 sweep.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
