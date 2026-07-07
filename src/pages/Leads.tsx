import { FC } from 'react';
import { mockCompanies } from '../mockData';

export const Leads: FC = () => {
  return (
    <div>
      <LeadsView companies={mockCompanies} />
    </div>
  );
};
