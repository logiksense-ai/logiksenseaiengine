import { ScoreBadge } from './ScoreBadge';
import { SignalPill } from './SignalPill';
import { IconBuildingSkyscraper, IconUserPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

interface LeadCardProps {
  id: string;
  name: string;
  industry: string;
  location: string;
  employees: number;
  score: number;
  tier: 'cold' | 'warm' | 'high' | 'immediate';
  angle: string;
}

export const LeadCard: React.FC<LeadCardProps> = ({ id, name, industry, location, employees, score, tier, angle }) => {
  return (
    <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Link to={`/leads/${id}`} style={{ textDecoration: 'none' }}>
            <h3 className="text-company-name" style={{ marginBottom: '4px' }}>{name}</h3>
          </Link>
          <div className="text-supporting">
            {industry} · {location} · ~{employees} employees
          </div>
        </div>
        <ScoreBadge score={score} tier={tier} label={tier.charAt(0).toUpperCase() + tier.slice(1)} />
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <SignalPill icon={<IconBuildingSkyscraper size={14} />} label="New ABN" recency="12 days ago" />
        <SignalPill icon={<IconUserPlus size={14} />} label="Hiring office manager" recency="2 days ago" />
      </div>

      <div style={{ padding: '12px', backgroundColor: 'var(--bg-panel)', borderRadius: '4px', borderLeft: '2px solid var(--color-indigo-600)' }}>
        <span className="text-caption" style={{ color: 'var(--color-indigo-300)', display: 'block', marginBottom: '4px' }}>Suggested angle</span>
        <span className="text-body">{angle}</span>
      </div>
    </div>
  );
};
