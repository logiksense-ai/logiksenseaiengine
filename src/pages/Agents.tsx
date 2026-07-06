import React from 'react';
import { OrchestratorView } from '../components/OrchestratorView';
import { mockAgents, mockLogs } from '../mockData';

export const Agents: React.FC = () => {
  return (
    <div>
      <OrchestratorView 
        agents={mockAgents} 
        logs={mockLogs} 
        onTriggerAgent={(id) => console.log('Triggering agent', id)}
        onTriggerAll={() => console.log('Triggering all agents')}
      />
    </div>
  );
};
