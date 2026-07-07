import { useState, FC } from 'react';
import type { ICPTemplate, Company } from '../types';
import { Sparkles, Sliders } from 'lucide-react';

interface ICPBuilderViewProps {
  icpTemplate: ICPTemplate;
  onSaveTemplate: (newTemplate: ICPTemplate) => void;
  companies: Company[];
}

export const ICPBuilderView: FC<ICPBuilderViewProps> = ({ icpTemplate, onSaveTemplate, companies }) => {
  const [industries, setIndustries] = useState<string[]>(icpTemplate.targetIndustries);
  const minHeadcount = icpTemplate.minHeadcount;
  const [maxHeadcount, setMaxHeadcount] = useState<number>(icpTemplate.maxHeadcount);
  const [requiredTech, setRequiredTech] = useState<string[]>(icpTemplate.requiredTech);
  const [minIntent, setMinIntent] = useState<number>(icpTemplate.minIntentScore);

  const availableIndustries = ['Financial Technology', 'Software Engineering', 'Manufacturing', 'Trades & Construction', 'Healthcare', 'Legal Services'];
  const availableTech = ['AWS', 'Salesforce', 'HubSpot', 'Xero', 'MYOB', 'SAP', 'WordPress'];

  const handleIndustryToggle = (ind: string) => {
    setIndustries(prev => prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]);
  };

  const handleTechToggle = (tech: string) => {
    setRequiredTech(prev => prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]);
  };

  const handleSave = () => {
    onSaveTemplate({
      targetIndustries: industries,
      minHeadcount,
      maxHeadcount,
      requiredTech,
      minIntentScore: minIntent
    });
  };

  // Dynamic simulation of matching accounts based on current state
  const matchingCompanies = companies.filter(c => {
    const indMatch = industries.includes(c.industry);
    const countMatch = c.headcount >= minHeadcount && c.headcount <= maxHeadcount;
    const scoreMatch = c.intentScore >= minIntent;
    return indMatch && countMatch && scoreMatch;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', animation: 'fadeIn 0.5s ease-in-out' }}>
      
      {/* Editor Panel */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={22} style={{ color: 'var(--color-primary)' }} /> ICP Template Builder
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Configure criteria to automatically grade target accounts (Grade A to F) and trigger prioritization cues.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '1px solid var(--border-glow)', paddingTop: '20px' }}>
          
          {/* Target Industries */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Target Industries</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {availableIndustries.map(ind => {
                const active = industries.includes(ind);
                return (
                  <button
                    key={ind}
                    onClick={() => handleIndustryToggle(ind)}
                    style={{
                      background: active ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                      border: '1px solid',
                      borderColor: active ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                      color: active ? 'var(--color-primary)' : 'var(--text-muted)',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      transition: 'all 0.2s'
                    }}
                  >
                    {ind}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Headcount Limits */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
              <span>Headcount Range</span>
              <span style={{ color: 'var(--color-secondary)' }}>{minHeadcount} - {maxHeadcount} employees</span>
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <input 
                type="range" 
                min="1" 
                max="500" 
                value={maxHeadcount} 
                onChange={e => setMaxHeadcount(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--color-primary)' }}
              />
            </div>
          </div>

          {/* Technographic Dependencies */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Technographic Install Stack</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {availableTech.map(tech => {
                const active = requiredTech.includes(tech);
                return (
                  <button
                    key={tech}
                    onClick={() => handleTechToggle(tech)}
                    style={{
                      background: active ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.02)',
                      border: '1px solid',
                      borderColor: active ? 'var(--color-secondary)' : 'rgba(255,255,255,0.05)',
                      color: active ? 'var(--color-secondary)' : 'var(--text-muted)',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      transition: 'all 0.2s'
                    }}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minimum Intent Score */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
              <span>Minimum Intent Score Target</span>
              <span style={{ color: 'var(--color-warning)' }}>Score: {minIntent}+</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={minIntent} 
              onChange={e => setMinIntent(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-warning)' }}
            />
          </div>

          <button 
            className="button-primary"
            onClick={handleSave}
            style={{ alignSelf: 'start', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', marginTop: '10px' }}
          >
            Apply & Save Profile Rules
          </button>

        </div>
      </div>

      {/* Profile Grading & Simulator Preview */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(9, 13, 22, 0.2) 100%)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} style={{ color: 'var(--color-secondary)' }} /> Profile Fit Simulator
        </h3>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          Real-time preview of database matches based on target rules.
        </p>

        {/* Matches Indicator */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-glow)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>MATCHING ACCOUNTS</div>
          <div style={{ fontSize: '36px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-secondary)' }}>
            {matchingCompanies.length} <span style={{ fontSize: '18px', color: 'var(--text-muted)', fontWeight: 500 }}>companies</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-success)' }}>
            Representing {Math.round((matchingCompanies.length / companies.length) * 100)}% of tracked accounts
          </div>
        </div>

        {/* Live grades matching preview list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>PREVIEW GRADES UNDER RULES</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {companies.map(c => {
              const indMatch = industries.includes(c.industry);
              const countMatch = c.headcount >= minHeadcount && c.headcount <= maxHeadcount;
              const isMatch = indMatch && countMatch;
              
              return (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.15)', padding: '10px 14px', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.industry} | {c.headcount} emp</div>
                  </div>
                  <span style={{ 
                    background: isMatch ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
                    color: isMatch ? 'var(--color-success)' : 'var(--color-danger)', 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px', 
                    fontWeight: 700 
                  }}>
                    {isMatch ? 'Grade A' : 'Grade F'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};
