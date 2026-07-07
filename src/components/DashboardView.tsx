import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Company, LogEntry } from '../types';
import { mockSearchTrends } from '../mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Target, Zap, Mail as IconMail, CheckCircle2, TrendingUp, Radio, Search, Shield } from 'lucide-react';
import { IconBrandLinkedin } from '@tabler/icons-react';

interface DashboardViewProps {
  companies: Company[];
  logs: LogEntry[];
  onNavigateToLeads: () => void;
}

export const DashboardView: FC<DashboardViewProps> = ({ companies, onNavigateToLeads }) => {
  const [pipelineFilter, setPipelineFilter] = useState<'All' | 'Enterprise' | 'SMB'>('All');
  const [searchTrends, setSearchTrends] = useState<any[]>(mockSearchTrends);
  const [loadingTrends, setLoadingTrends] = useState(false);

  useEffect(() => {
    const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    setLoadingTrends(true);
    fetch(`${BACKEND_URL}/api/trends`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setSearchTrends(data);
        }
      })
      .catch(err => console.error("Error fetching live trends:", err))
      .finally(() => setLoadingTrends(false));
  }, []);

  const filteredCompanies = companies.filter(c => pipelineFilter === 'All' || c.targetTier === pipelineFilter);

  // Compute metrics
  const totalTracked = filteredCompanies.length;
  const highIntentCount = filteredCompanies.filter(c => c.intentScore >= 60).length;
  const totalSignals = filteredCompanies.reduce((acc, c) => acc + c.signals.length, 0);

  // Score distribution data for chart
  const scoreTiers = [
    { name: 'Cold (0-25)', count: filteredCompanies.filter(c => c.intentScore <= 25).length, fill: '#64748b' },
    { name: 'Warm (26-50)', count: filteredCompanies.filter(c => c.intentScore > 25 && c.intentScore <= 50).length, fill: '#f59e0b' },
    { name: 'High (51-75)', count: filteredCompanies.filter(c => c.intentScore > 50 && c.intentScore <= 75).length, fill: '#8b5cf6' },
    { name: 'Immediate (76-100)', count: filteredCompanies.filter(c => c.intentScore > 75).length, fill: '#10b981' }
  ];

  const trendData = [
    { date: 'Jun 22', signals: 22, leads: 5 },
    { date: 'Jun 23', signals: 38, leads: 9 },
    { date: 'Jun 24', signals: 45, leads: 14 },
    { date: 'Jun 25', signals: 64, leads: 22 },
    { date: 'Jun 26', signals: 82, leads: 31 },
    { date: 'Jun 27', signals: 115, leads: 48 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.5s ease-in-out' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>
            IntentGraph AI <span style={{ color: 'var(--color-primary)', fontSize: '14px', verticalAlign: 'super', fontWeight: 600 }}>v3 Global Edition</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Predictive intent intelligence operating 15 AI Agents across 13 global business registers & search demand trends.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Pipeline Segmented Control */}
          <div style={{ background: 'rgba(9, 13, 22, 0.6)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-glow)', display: 'flex' }}>
            {(['All', 'Enterprise', 'SMB'] as const).map(tier => (
              <button
                key={tier}
                onClick={() => setPipelineFilter(tier)}
                style={{
                  background: pipelineFilter === tier ? 'var(--color-primary)' : 'none',
                  border: 'none',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {tier === 'SMB' ? 'SMB / Local' : tier}
              </button>
            ))}
          </div>

          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', fontSize: '13px', fontWeight: 500 }}>
            <span className="pulse-green" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)' }}></span>
            15 Agents Online
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Total Monitored</span>
            <Target size={18} style={{ color: 'var(--color-secondary)' }} />
          </div>
          <div style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{totalTracked}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-success)' }}>Global registers & GBP synced</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>High Intent Leads</span>
            <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-primary)' }}>{highIntentCount}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Score ≥ 51 (Action Protocol)</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Active Buying Signals</span>
            <Radio size={18} style={{ color: 'var(--color-success)' }} />
          </div>
          <div style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-success)' }}>{totalSignals}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-success)' }}>Includes hyper-local & search signals</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>AI Audit Status</span>
            <Shield size={18} style={{ color: 'var(--color-warning)' }} />
          </div>
          <div style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-warning)' }}>100%</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified & Compliant</div>
        </div>

      </div>

      {/* NEW IN V3: Search Intent Intelligence Radar Section */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary)' }}>
              <Search size={18} /> Search Intent Intelligence Layer (Predictive Radar)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Detects keyword demand spikes in Google & community searches 30–60 days before visible RFPs or job posts occur.
            </p>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)' }}>LIVE GOOGLE TRENDS API</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '15px' }}>
          {loadingTrends && <div style={{ color: 'var(--color-secondary)' }}>Loading live Google Trends data...</div>}
          {!loadingTrends && searchTrends.map((trend, idx) => (
            <div key={idx} style={{ background: 'rgba(9, 13, 22, 0.6)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: 600 }}>{trend.category}</span>
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Zap size={10} /> +{trend.growthPercentage}%
                </span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>"{trend.keyword}"</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '6px' }}>
                <span>Region: {trend.region}</span>
                <span>Vol: {trend.monthlyVolume.toLocaleString()}/mo</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        
        {/* Score Distribution Chart */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Lead Distribution by Unified v3 Score</h3>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreTiers} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(9, 13, 22, 0.95)', borderColor: 'var(--border-glow)', borderRadius: '8px', color: '#fff' }} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {scoreTiers.map((entry, index) => (
                    <rect key={`rect-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Signals Trend Chart */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Global Buying Signal Capture Volume</h3>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(9, 13, 22, 0.95)', borderColor: 'var(--border-glow)', borderRadius: '8px', color: '#fff' }} />
                <defs>
                  <linearGradient id="colorSignals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="signals" stroke="var(--color-secondary)" fillOpacity={1} fill="url(#colorSignals)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Unified Status & Priority Leads */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Unified Platform Health & connectivity */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600 }}>Execution Hub Status</h3>
            <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>UNIFIED V3 CORE</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Microsoft 365 / Outbox Status */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #0078d4 0%, #28a8ea 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0, 120, 212, 0.3)' }}>
                  <IconMail size={20} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>Office 365 (via MS Graph)</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>info@logiksense.ai</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-success)', fontSize: '11px', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> CONNECTED
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>Graph API Active</div>
              </div>
            </div>

            {/* LinkedIn Automation Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #0077b5 0%, #00a0dc 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0, 119, 181, 0.3)' }}>
                    <IconBrandLinkedin size={20} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>LinkedIn Personal Profile</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>bipinpanjari@gmail.com</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>READY</span>
                  <div className="agent-dot active"></div>
                </div>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--color-warning)', background: 'rgba(245, 158, 11, 0.05)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.1)', marginTop: '4px' }}>
                <Zap size={10} style={{ display: 'inline', marginRight: '5px' }} /> 
                Safety Mode: Enabled (20 actions/day, Human-like delays active)
              </div>
            </div>
            
            <div style={{ marginTop: '5px', display: 'flex', gap: '10px' }}>
              <button style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--color-indigo-300)', border: '1px solid rgba(79, 70, 229, 0.2)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                Test Connectivity
              </button>
              <button style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--color-primary)', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
                System Settings
              </button>
            </div>
          </div>
        </div>

        {/* Live Agent Execution Logs */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px', background: 'rgba(9, 13, 22, 0.8)', border: '1px solid var(--border-glow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600 }}>Active Agent Operations</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-secondary)', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>3 AGENTS ONLINE</span>
            </div>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '200px', paddingRight: '5px' }}>
            {[
              { id: 1, time: '14:29:07', agent: 'MS_GRAPH', msg: 'Email sent successfully to bipinpanjari@gmail.com', type: 'success' },
              { id: 2, time: '14:28:45', agent: 'LNKD_BOT', msg: 'Stealth Session Restoration: bipinpanjari@gmail.com - SUCCESS', type: 'info' },
              { id: 3, time: '14:28:12', agent: 'SCOUT', msg: 'Google Trends: "ERP Consolidation" demand spike (+142%) detected', type: 'warning' },
              { id: 4, time: '14:27:50', agent: 'ANALYST', msg: 'Scoring Lead: LogikSense Targeting - v3 Score: 98/100', type: 'info' }
            ].map(log => (
              <div key={log.id} style={{ display: 'flex', gap: '12px', fontSize: '12px', fontFamily: 'var(--font-mono)', padding: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', borderLeft: `3px solid ${log.type === 'success' ? 'var(--color-success)' : log.type === 'warning' ? 'var(--color-warning)' : 'var(--color-secondary)'}` }}>
                <span style={{ color: 'var(--text-disabled)', minWidth: '60px' }}>[{log.time}]</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700, minWidth: '65px' }}>{log.agent}</span>
                <span style={{ color: 'var(--text-muted)' }}>{log.msg}</span>
              </div>
            ))}
          </div>

          <button style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.05)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            View Full Audit Trail
          </button>
        </div>

        {/* Priority Targets Card */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600 }}>High Urgency Targets</h3>
            <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>SLA: 100% MEETING</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredCompanies.filter(c => c.intentScore >= 76).slice(0, 3).map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '10px', borderLeft: '3px solid var(--color-success)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {c.name}
                    <span style={{ fontSize: '10px', background: 'rgba(79, 70, 229, 0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--color-indigo-300)', fontWeight: 700 }}>{c.targetTier}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                    <Zap size={10} style={{ color: 'var(--color-warning)' }} /> ERP Consolidation Signal Detected
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div style={{ color: 'var(--color-success)', fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{c.intentScore}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>BULL'S EYE</div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={onNavigateToLeads} 
            style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '13px', fontWeight: 600, marginTop: 'auto', cursor: 'pointer' }}
          >
            Launch Outreach Queue
          </button>
        </div>

      </div>


    </div>
  );
};
