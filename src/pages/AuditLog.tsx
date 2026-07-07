import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { 
  IconHistory, 
  IconCheck, 
  IconAlertTriangle, 
  IconInfoCircle,
  IconFilter,
  IconDownload,
  IconShieldCheck,
  IconUser,
  IconExternalLink
} from '@tabler/icons-react';

interface AuditLogEntry {
  id: number;
  agent_id: number;
  agent_name: string;
  log_type: string;
  message: string;
  timestamp: string;
}

export const AuditLog: FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/audit/logs`);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  const getLogIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'success': return <IconCheck size={16} color="#10b981" />;
      case 'warning': return <IconAlertTriangle size={16} color="#f59e0b" />;
      case 'error': return <IconAlertTriangle size={16} color="#ef4444" />;
      default: return <IconInfoCircle size={16} color="var(--color-primary)" />;
    }
  };

  return (
    <div className="page-container" style={{ padding: '30px', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <IconShieldCheck size={32} color="var(--color-primary)" />
            Audit & Compliance Log
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            Real-time tracking of all system mutations and agent executions.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="glass-panel" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)' }}>
            Export Logs
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>Events (Recorded)</div>
          <div style={{ fontSize: '24px', fontWeight: 700 }}>{logs.length}</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>Security Status</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>COMPLIANT</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>System Integrity</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-secondary)' }}>100%</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconHistory size={20} color="var(--text-muted)" />
            <span style={{ fontWeight: 600 }}>Decisions & Mutations</span>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <IconFilter size={16} />
            Filter Log
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 20px' }}>Timestamp</th>
                <th style={{ padding: '12px 20px' }}>Actor (AI Agent)</th>
                <th style={{ padding: '12px 20px' }}>Type</th>
                <th style={{ padding: '12px 20px' }}>Message</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Ref</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="table-row-hover">
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconUser size={14} />
                      </div>
                      {log.agent_name || `Agent #${log.agent_id}`}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {getLogIcon(log.log_type)}
                      <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>{log.log_type}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-muted)' }}>{log.message}</td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-disabled)', cursor: 'pointer' }}>
                      <IconExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && logs.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No audit records found. Agent activity will appear here in real-time.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
