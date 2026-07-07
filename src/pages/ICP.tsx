import { useState } from 'react';
import type { FC } from 'react';
import { ICPBuilderView } from '../components/ICPBuilderView';
import { mockCompanies } from '../mockData';
import type { ICPTemplate } from '../types';

export const ICP: FC = () => {
  const [template, setTemplate] = useState<ICPTemplate>({
    targetIndustries: ['Software Engineering', 'Financial Technology'],
    minHeadcount: 10,
    maxHeadcount: 1000,
    requiredTech: ['AWS', 'Salesforce'],
    minIntentScore: 60
  });

  const handleSave = (newTemplate: ICPTemplate) => {
    setTemplate(newTemplate);
    alert('ICP Template saved and synced with agents!');
  };

  return (
    <div style={{ padding: '30px', animation: 'fadeIn 0.4s ease-out' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 className="text-page-title">Ideal Customer Profile (ICP)</h1>
        <p className="text-body" style={{ color: 'var(--text-muted)' }}> Define the parameters for high-value targets. LogikSense agents prioritize leads matching these characteristics.</p>
      </header>
      
      <ICPBuilderView 
        icpTemplate={template} 
        onSaveTemplate={handleSave} 
        companies={mockCompanies} 
      />
    </div>
  );
};
