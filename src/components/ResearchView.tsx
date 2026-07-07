import { useState, useRef, useEffect } from 'react';
import { 
  Search, Globe, Code2, Shield, 
  ExternalLink, CheckCircle2, Loader2, Clock,
  Building2, AlertTriangle, 
  FileText, MessageSquare, Zap, Eye
} from 'lucide-react';

// ── Types (matching backend response) ─────────────────────

interface ResearchStep {
  id: string;
  agentId: number;
  agentName: string;
  description: string;
  sourceUrl: string;
  status: 'pending' | 'running' | 'done' | 'error';
  result?: string;
  dataPoints?: number;
  durationMs?: number;
}

interface DiscoveredItem {
  label: string;
  value: string;
  source: string;
  sourceUrl: string;
  confidence: number;
}

interface DiscoveredSection {
  category: string;
  items: DiscoveredItem[];
}

interface ResearchResponse {
  query: string;
  domain: string;
  timestamp: string;
  steps: ResearchStep[];
  sections: DiscoveredSection[];
  totalDataPoints: number;
  errors: string[];
}

// ── Category icon mapping ─────────────────────────────────

function getCategoryIcon(category: string): React.ReactNode {
  if (category.includes("WHOIS") || category.includes("Registration")) return <Building2 size={16} />;
  if (category.includes("DNS")) return <Globe size={16} />;
  if (category.includes("HTTP") || category.includes("Technology")) return <Code2 size={16} />;
  if (category.includes("Website") || category.includes("Content")) return <Code2 size={16} />;
  if (category.includes("SSL") || category.includes("TLS")) return <Shield size={16} />;
  if (category.includes("Hacker") || category.includes("Mention")) return <MessageSquare size={16} />;
  if (category.includes("Requires")) return <AlertTriangle size={16} />;
  return <FileText size={16} />;
}

// ── Main Component ──────────────────────────────────────

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const ResearchView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [researchComplete, setResearchComplete] = useState(false);
  const [steps, setSteps] = useState<ResearchStep[]>([]);
  const [sections, setSections] = useState<DiscoveredSection[]>([]);
  const [totalDataPoints, setTotalDataPoints] = useState(0);
  const [_errors, setErrors] = useState<string[]>([]);
  const [backendError, setBackendError] = useState<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [steps]);

  const startResearch = async () => {
    if (!searchQuery.trim()) return;

    setIsResearching(true);
    setResearchComplete(false);
    setSections([]);
    setTotalDataPoints(0);
    setErrors([]);
    setBackendError(null);

    // Show a placeholder "running" state while the backend works
    const placeholderSteps: ResearchStep[] = [
      { id: 'whois', agentId: 1, agentName: 'Company Discovery', description: `WHOIS lookup for ${searchQuery}`, sourceUrl: '', status: 'running' },
      { id: 'dns', agentId: 1, agentName: 'Company Discovery', description: 'DNS record resolution', sourceUrl: '', status: 'pending' },
      { id: 'tech', agentId: 8, agentName: 'Tech Detection', description: 'HTTP header analysis', sourceUrl: '', status: 'pending' },
      { id: 'crawl', agentId: 2, agentName: 'Website Monitor', description: 'Live website crawl & content extraction', sourceUrl: '', status: 'pending' },
      { id: 'ssl', agentId: 8, agentName: 'Tech Detection', description: 'SSL/TLS certificate inspection', sourceUrl: '', status: 'pending' },
      { id: 'hn', agentId: 6, agentName: 'Public Conversation', description: 'HackerNews search', sourceUrl: '', status: 'pending' },
    ];
    setSteps(placeholderSteps);

    // Animate placeholder steps to "running" one by one while waiting
    const animationIntervals: ReturnType<typeof setTimeout>[] = [];
    placeholderSteps.forEach((_, idx) => {
      if (idx === 0) return; // first is already running
      const timer = setTimeout(() => {
        setSteps(prev => prev.map((s, i) => i === idx ? { ...s, status: 'running' } : s));
      }, idx * 1200);
      animationIntervals.push(timer);
    });

    try {
      const resp = await fetch(`${BACKEND_URL}/api/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });

      // Clear animation timers
      animationIntervals.forEach(clearTimeout);

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.detail || `Backend returned ${resp.status}`);
      }

      const data: ResearchResponse = await resp.json();

      setSteps(data.steps);
      setSections(data.sections);
      setTotalDataPoints(data.totalDataPoints);
      setErrors(data.errors);
      setResearchComplete(true);

    } catch (err: unknown) {
      // Clear animation timers
      animationIntervals.forEach(clearTimeout);
      
      const message = err instanceof Error ? err.message : 'Unknown error';
      setBackendError(
        message.includes('Failed to fetch') || message.includes('NetworkError')
          ? `Cannot connect to backend at ${BACKEND_URL}. Start it with: cd backend && uvicorn main:app --reload --port 8000`
          : `Research failed: ${message}`
      );
      setSteps(prev => prev.map(s => ({ ...s, status: 'error' as const, result: 'Aborted' })));
    } finally {
      setIsResearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') startResearch();
  };

  const getConfidenceColor = (c: number) => {
    if (c >= 90) return 'var(--color-success)';
    if (c >= 70) return 'var(--color-secondary)';
    if (c >= 50) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const completedSteps = steps.filter(s => s.status === 'done').length;
  const errorSteps = steps.filter(s => s.status === 'error').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease-out' }}>

      {/* ── Search Header ──────────────────────────────────── */}
      <div className="glass-panel" style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(6, 182, 212, 0.04) 100%)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h2 className="gradient-text" style={{ fontSize: '26px', fontWeight: 800 }}>
              Live Business Research
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px', maxWidth: '700px' }}>
              Enter any company name or domain. IntentGraph will query <strong style={{ color: 'var(--text-main)' }}>real data sources</strong> — 
              WHOIS, DNS, HTTP headers, website HTML, SSL certificates, and HackerNews. 
              Every data point is fetched live with full source transparency.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '600px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. stripe.com, google.com, logiksense.ai..."
                disabled={isResearching}
                style={{
                  width: '100%',
                  background: 'rgba(9, 13, 22, 0.7)',
                  border: '1px solid var(--border-glow)',
                  color: 'var(--text-main)',
                  padding: '14px 16px 14px 46px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>
            <button
              className="button-primary"
              onClick={startResearch}
              disabled={isResearching || !searchQuery.trim()}
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: (isResearching || !searchQuery.trim()) ? 0.5 : 1,
              }}
            >
              {isResearching ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Zap size={16} />}
              {isResearching ? 'Researching...' : 'Research'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Backend Connection Error ──────────────────────── */}
      {backendError && (
        <div className="glass-panel" style={{ padding: '20px', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <AlertTriangle size={20} style={{ color: 'var(--color-danger)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-danger)' }}>Research Engine Error</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>{backendError}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Agent Execution Chain + Results ────────────────── */}
      {steps.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: researchComplete ? '0.42fr 0.58fr' : '1fr', gap: '20px', transition: 'all 0.4s ease' }}>
          
          {/* Left: Agent Pipeline Ticker */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={16} style={{ color: 'var(--color-secondary)' }} /> Agent Execution Pipeline
              </h3>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>{completedSteps}</span> / {steps.length} done
                </span>
                {errorSteps > 0 && (
                  <span style={{ fontSize: '12px', color: 'var(--color-danger)' }}>
                    {errorSteps} failed
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', height: '4px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${((completedSteps + errorSteps) / Math.max(steps.length, 1)) * 100}%`,
                background: errorSteps > 0 
                  ? 'linear-gradient(90deg, var(--color-primary), var(--color-danger))' 
                  : 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                borderRadius: '6px',
                transition: 'width 0.5s ease-out'
              }} />
            </div>

            {/* Real data badge */}
            {researchComplete && (
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.08)', 
                border: '1px solid rgba(16, 185, 129, 0.2)', 
                borderRadius: '8px', 
                padding: '8px 12px',
                fontSize: '12px',
                color: 'var(--color-success)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CheckCircle2 size={14} /> All data below is real — fetched live from the internet
              </div>
            )}

            {/* Step List */}
            <div 
              ref={logContainerRef}
              style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}
            >
              {steps.map(step => (
                <div
                  key={step.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: step.status === 'running' ? 'rgba(139, 92, 246, 0.08)' : 
                                step.status === 'done' ? 'rgba(16, 185, 129, 0.04)' :
                                step.status === 'error' ? 'rgba(239, 68, 68, 0.04)' : 'rgba(255,255,255,0.01)',
                    border: '1px solid',
                    borderColor: step.status === 'running' ? 'rgba(139, 92, 246, 0.2)' : 
                                 step.status === 'done' ? 'rgba(16, 185, 129, 0.1)' :
                                 step.status === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.03)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ marginTop: '2px', flexShrink: 0 }}>
                    {step.status === 'pending' && <Clock size={14} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />}
                    {step.status === 'running' && <Loader2 size={14} style={{ color: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />}
                    {step.status === 'done' && <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} />}
                    {step.status === 'error' && <AlertTriangle size={14} style={{ color: 'var(--color-danger)' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: step.status === 'pending' ? 'var(--text-muted)' : 'var(--text-main)' }}>
                        Agent {step.agentId}: {step.agentName}
                      </span>
                      {step.durationMs != null && (
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                          {step.durationMs}ms
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{step.description}</div>
                    {step.result && (
                      <div style={{ fontSize: '11px', color: step.status === 'error' ? 'var(--color-danger)' : 'var(--color-success)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                        {step.status === 'error' ? '✗' : '✓'} {step.result}
                      </div>
                    )}
                    {step.sourceUrl && step.status === 'done' && (
                      <div style={{ marginTop: '4px' }}>
                        <a href={step.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', color: 'var(--color-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px', opacity: 0.8 }}>
                          <ExternalLink size={9} /> {step.sourceUrl.length > 55 ? step.sourceUrl.slice(0, 55) + '...' : step.sourceUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Real Intelligence Report */}
          {researchComplete && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Summary Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>DATA POINTS</div>
                  <div style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px' }}>
                    {totalDataPoints}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>collected live</div>
                </div>
                <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>SOURCES</div>
                  <div style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-secondary)', marginTop: '4px' }}>
                    {sections.length}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>categories</div>
                </div>
                <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>AGENTS RAN</div>
                  <div style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-success)', marginTop: '4px' }}>
                    {completedSteps}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ {steps.length} completed</div>
                </div>
              </div>

              {/* Report Sections */}
              <div className="glass-panel" style={{ padding: '24px', maxHeight: '560px', overflowY: 'auto' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} style={{ color: 'var(--color-primary)' }} /> 
                  Intelligence Report — <span style={{ color: 'var(--color-secondary)' }}>{searchQuery}</span>
                </h3>

                {sections.length === 0 && (
                  <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px', fontSize: '14px' }}>
                    No data could be retrieved for this query. The domain may not exist or may be blocking requests.
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {sections.map((section, sIdx) => (
                    <div key={sIdx}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ color: section.category.includes('Requires') ? 'var(--color-warning)' : 'var(--color-primary)' }}>
                          {getCategoryIcon(section.category)}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{section.category}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>{section.items.length} fields</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {section.items.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '0.3fr 0.38fr 0.22fr 0.1fr',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              background: item.confidence === 0 ? 'rgba(245, 158, 11, 0.03)' : 'rgba(255,255,255,0.015)',
                              fontSize: '12px',
                            }}
                          >
                            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{item.label}</span>
                            <span style={{ color: item.confidence === 0 ? 'var(--color-warning)' : 'var(--text-main)', fontWeight: 600, wordBreak: 'break-word' }}>
                              {item.value.length > 120 ? item.value.slice(0, 120) + '...' : item.value}
                            </span>
                            {item.sourceUrl ? (
                              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <ExternalLink size={9} /> {item.source.length > 30 ? item.source.slice(0, 30) + '...' : item.source}
                              </a>
                            ) : (
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.source}</span>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                              {item.confidence > 0 ? (
                                <>
                                  <div style={{ width: '24px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                    <div style={{ width: `${item.confidence}%`, height: '100%', background: getConfidenceColor(item.confidence), borderRadius: '2px' }} />
                                  </div>
                                  <span style={{ fontSize: '10px', color: getConfidenceColor(item.confidence), fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                                    {item.confidence}%
                                  </span>
                                </>
                              ) : (
                                <span style={{ fontSize: '10px', color: 'var(--color-warning)', fontFamily: 'var(--font-mono)' }}>—</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Empty State ──────────────────────────────────── */}
      {steps.length === 0 && !backendError && (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.1))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <Globe size={32} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
              Enter any business to begin
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '520px', lineHeight: 1.6 }}>
              IntentGraph will query <strong style={{ color: 'var(--text-main)' }}>real sources</strong> — 
              WHOIS registries, DNS resolvers, live HTTP headers, website HTML, SSL certificates, 
              and the HackerNews API. Every data point is genuine with its original source URL.
            </p>
            <p style={{ color: 'var(--color-warning)', fontSize: '12px', marginTop: '8px' }}>
              ⚠ Requires backend running: <code style={{ fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>cd backend && uvicorn main:app --reload --port 8000</code>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
            {['google.com', 'stripe.com', 'github.com'].map(ex => (
              <button
                key={ex}
                onClick={() => setSearchQuery(ex)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: 'var(--color-secondary)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
