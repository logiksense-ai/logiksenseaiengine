import { FC } from 'react';
import { mockAgents, mockLogs } from '../mockData';

export const Agents: FC = () => {
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
