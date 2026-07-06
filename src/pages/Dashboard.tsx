import React from 'react';
import { DashboardView } from '../components/DashboardView';
import { mockCompanies } from '../mockData';

export const Dashboard: React.FC = () => {
  const logs = [
    { timestamp: new Date().toISOString(), agentId: 1, type: 'info', message: 'Ruflo Swarm: Scoping Seek.com.au for "bookkeeping automation"' },
    { timestamp: new Date().toISOString(), agentId: 2, type: 'success', message: 'Analyst: Verified intent signal for Greenfield Constructions' },
  ];

  return (
    <div>
      <DashboardView 
        companies={mockCompanies} 
        logs={logs} 
        onNavigateToLeads={() => {}} 
      />
    </div>
  );
};
