import { LeadsView } from '../components/LeadsView';
import { mockCompanies } from '../mockData';

export const Leads: React.FC = () => {
  return (
    <div>
      <LeadsView companies={mockCompanies} />
    </div>
  );
};
