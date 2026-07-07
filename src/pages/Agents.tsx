import type { FC } from 'react';
import { OrchestratorView } from '../components/OrchestratorView';
import { mockAgents, mockLogs } from '../mockData';

export const Agents: FC = () => {
  return (
    <div>
      <OrchestratorView 
        agents={mockAgents} 
        logs={mockLogs} 
        onTriggerAgent={(id: number) => console.log('Triggering agent', id)}
        onTriggerAll={() => console.log('Triggering all agents')}
      />
    </div>
  );
};
