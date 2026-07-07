import type { FC } from 'react';
import { OutreachView } from '../components/OutreachView';
import { mockCompanies } from '../mockData';
import { IconSend, IconSparkles } from '@tabler/icons-react';

export const Engagement: FC = () => {
  return (
    <div style={{ padding: '30px', animation: 'fadeIn 0.4s ease-out' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <IconSparkles size={32} color="var(--color-primary)" />
            AI Engagement Engine
          </h1>
          <p className="text-body" style={{ color: 'var(--text-muted)' }}>
            Personalized outreach generation for high-intent leads using the LogikSense Marketing models.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
           <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconSend size={18} /> Bulk Outreach
          </button>
        </div>
      </header>
      
      <OutreachView companies={mockCompanies} />
    </div>
  );
};
