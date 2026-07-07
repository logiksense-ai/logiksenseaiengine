import { DashboardView } from '../components/DashboardView';
import { mockCompanies } from '../mockData';
import type { LogEntry } from '../types';
import { useEffect, useState } from 'react';

export const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const logs: LogEntry[] = [
    { timestamp: new Date().toISOString(), agentId: 1, type: 'info', message: 'Ruflo Swarm: Scoping Seek.com.au for "bookkeeping automation"' },
    { timestamp: new Date().toISOString(), agentId: 2, type: 'success', message: 'Analyst: Verified intent signal for Greenfield Constructions' },
  ];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/analytics/kpis`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <DashboardView 
        companies={mockCompanies} 
        logs={logs} 
        stats={stats}
        loading={loading}
        onNavigateToLeads={() => {}} 
      />
    </div>
  );
};
