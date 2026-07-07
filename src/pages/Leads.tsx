import type { FC } from 'react';
import { LeadsView } from '../components/LeadsView';
import { mockCompanies } from '../mockData';

export const Leads: FC = () => {
  return (
    <div>
      <LeadsView companies={mockCompanies} />
    </div>
  );
};
