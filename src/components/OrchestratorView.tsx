import React, { useState } from 'react';
import type { AgentStatus, LogEntry } from '../types';
import { Play, Terminal, Server, ShieldCheck, Activity, RefreshCw, Layers } from 'lucide-react';

interface OrchestratorViewProps {
  agents: AgentStatus[];
  logs: LogEntry[];
  onTriggerAgent: (id: number) => void;
  onTriggerAll: () => void;
}

export const OrchestratorView: React.FC<OrchestratorViewProps> = ({ agents, logs, onTriggerAgent, onTriggerAll }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);

  const getStatusBadge = (status: AgentStatus['status']) => {
    switch (status) {
      case 'success':
        return <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>Success</span>;
      case 'running':
        return <span style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--color-secondary)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>Running</span>;
      case 'failed':
        return <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-danger)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>Failed</span>;
      default:
        return <span style={{ background: 'rgba(148, 163, 184, 0.15)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>Idle</span>;
    }
  };

  const getStatusIcon = (status: AgentStatus['status']) => {
    switch (status) {
      case 'success':
        return <ShieldCheck size={18} style={{ color: 'var(--color-success)' }} />;
      case 'running':
        return <RefreshCw size={18} style={{ color: 'var(--color-secondary)', animation: 'spin 2s linear infinite' }} />;
      case 'failed':
        return <Server size={18} style={{ color: 'var(--color-danger)' }} />;
      default:
        return <Server size={18} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  const filteredLogs = selectedAgentId 
    ? logs.filter(l => l.agentId === selectedAgentId) 
    : logs;

  const enterpriseAgents = agents.filter(a => a.tier === 'Enterprise');
  const smbAgents = agents.filter(a => a.tier === 'SMB/Local');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', animation: 'fadeIn 0.5s ease-in-out' }}>
      
      {/* 15-Agent Status Dashboard */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={22} style={{ color: 'var(--color-primary)' }} /> 15-Agent Control Matrix (v3)
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Orchestrating discrete AI agent routines across Enterprise & SMB/Local tiers.
            </p>
          </div>
          
          <button 
            className="button-primary"
            onClick={onTriggerAll}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
          >
            <Play size={14} /> Run Global Sweep
          </button>
        </div>

        <div style={{ overflowY: 'auto', maxHeight: '580px', display: 'flex', flexDirection: 'column', gap: '24px', paddingRight: '5px' }}>
          
          {/* NEW IN V3: SMB & Local Tier Section */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} /> SMB & Hyper-Local Tier (Agents 14–15)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
              {smbAgents.map(agent => (
                <div 
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id === selectedAgentId ? null : agent.id)}
                  className="glass-panel"
                  style={{ 
                    padding: '16px', 
                    cursor: 'pointer',
                    background: agent.id === selectedAgentId ? 'rgba(6, 182, 212, 0.12)' : 'rgba(6, 182, 212, 0.04)',
                    borderColor: agent.id === selectedAgentId ? 'var(--color-secondary)' : 'rgba(6, 182, 212, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getStatusIcon(agent.status)}
                      <span style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>
                        Agent {agent.id}: {agent.name}
                      </span>
                    </div>
                    {getStatusBadge(agent.status)}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', minHeight: '36px' }}>
                    {agent.responsibilities}
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                    <span style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {agent.outputType}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onTriggerAgent(agent.id); }}
                      style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
                    >
                      Sync
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise Tier Section */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} /> Enterprise Tier (Agents 01–13)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
              {enterpriseAgents.map(agent => (
                <div 
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id === selectedAgentId ? null : agent.id)}
                  className="glass-panel"
                  style={{ 
                    padding: '16px', 
                    cursor: 'pointer',
                    background: agent.id === selectedAgentId ? 'rgba(139, 92, 246, 0.08)' : 'var(--bg-card)',
                    borderColor: agent.id === selectedAgentId ? 'var(--color-primary)' : 'var(--border-glow)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getStatusIcon(agent.status)}
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>
                        Agent {agent.id}: {agent.name}
                      </span>
                    </div>
                    {getStatusBadge(agent.status)}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', minHeight: '36px' }}>
                    {agent.responsibilities}
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                    <span style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {agent.outputType}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onTriggerAgent(agent.id); }}
                      style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
                    >
                      Sync
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Terminal logs */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: '#020308' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} style={{ color: 'var(--color-secondary)' }} /> Orchestrator Terminal Logs
          </h3>
          {selectedAgentId && (
            <button onClick={() => setSelectedAgentId(null)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '12px' }}>
              Clear Filter (Agent {selectedAgentId})
            </button>
          )}
        </div>

        <div style={{ 
          fontFamily: 'var(--font-mono)', 
          fontSize: '12px', 
          background: 'rgba(0,0,0,0.5)', 
          padding: '16px', 
          borderRadius: '8px', 
          flex: 1, 
          maxHeight: '520px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          border: '1px solid rgba(255, 255, 255, 0.03)'
        }}>
          {filteredLogs.map((log, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.01)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>[{log.timestamp}]</span>
              <span style={{ color: log.agentId >= 14 ? 'var(--color-secondary)' : 'var(--color-primary)' }}>[Agent {log.agentId}]</span>
              <span style={{ color: log.type === 'error' ? 'var(--color-danger)' : log.type === 'warn' ? 'var(--color-warning)' : log.type === 'success' ? 'var(--color-success)' : 'var(--text-main)' }}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
