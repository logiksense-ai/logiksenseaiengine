import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { 
  IconChartBar, 
  IconSend, 
  IconMailOpened, 
  IconMessageReply, 
  IconAlertTriangle,
  IconArrowUpRight,
  IconArrowDownRight
} from '@tabler/icons-react';

export const Analytics: FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/analytics/kpis`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Loading growth metrics...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.5s ease-out' }}>
      <header>
        <h1 className="text-page-title">Growth Analytics</h1>
        <p className="text-body" style={{ color: 'var(--text-muted)' }}>Real-time performance metrics across all autonomous channels.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <KpiCard 
          label="Emails Sent" 
          value={data.outreachStats.sent} 
          icon={<IconSend size={24} color="var(--color-indigo-400)" />} 
          trend="+12%" 
          trendUp={true}
        />
        <KpiCard 
          label="Open Rate" 
          value={`${data.outreachStats.openRate}%`} 
          icon={<IconMailOpened size={24} color="var(--color-emerald-400)" />} 
          trend="+2.4%" 
          trendUp={true}
        />
        <KpiCard 
          label="Reply Rate" 
          value={`${data.outreachStats.replyRate}%`} 
          icon={<IconMessageReply size={24} color="var(--color-blue-400)" />} 
          trend="-0.5%" 
          trendUp={false}
        />
        <KpiCard 
          label="Bounced" 
          value="42" 
          icon={<IconAlertTriangle size={24} color="var(--color-rose-400)" />} 
          trend="+8" 
          trendUp={false}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div className="card-panel" style={{ minHeight: '350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 className="text-section-header">Conversion Velocity</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="badge" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer' }}>7D</button>
              <button className="badge badge-indigo" style={{ border: 'none', cursor: 'pointer' }}>30D</button>
              <button className="badge" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer' }}>90D</button>
            </div>
          </div>
          
          <div style={{ padding: '60px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <IconChartBar size={48} style={{ opacity: 0.1, marginBottom: '12px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Interactive engagement chart migrating from LogikSense v3...</p>
          </div>
        </div>

        <div className="card-panel">
          <h3 className="text-section-header" style={{ marginBottom: '20px' }}>System Efficiency</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <EfficiencyItem label="Lead Discovery" percentage={94} color="var(--color-indigo-500)" />
            <EfficiencyItem label="AI Personalization" percentage={88} color="var(--color-emerald-500)" />
            <EfficiencyItem label="Inbox Matching" percentage={99} color="var(--color-blue-500)" />
            <EfficiencyItem label="Data Freshness" percentage={76} color="var(--color-amber-500)" />
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ label, value, icon, trend, trendUp }: any) => (
  <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>{icon}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: trendUp ? 'var(--color-emerald-500)' : 'var(--color-rose-500)' }}>
        {trendUp ? <IconArrowUpRight size={14} /> : <IconArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    <div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 700 }}>{value}</div>
    </div>
  </div>
);

const EfficiencyItem = ({ label, percentage, color }: any) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{percentage}%</span>
    </div>
    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: '3px' }}></div>
    </div>
  </div>
);
