import { useParams } from 'react-router-dom';

export const LeadDetail: React.FC = () => {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-page-title" style={{ marginBottom: '8px' }}>Intelligence Card: Lead #{id}</h1>
      <p className="text-body" style={{ marginBottom: '24px' }}>Detailed signals and outreach drafts would appear here.</p>
      
      <div className="card-panel" style={{ marginBottom: '24px' }}>
        <h3 className="text-section-heading" style={{ marginBottom: '16px' }}>Outreach Drafts</h3>
        
        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px', paddingBottom: '8px' }}>
          <span className="text-body" style={{ color: 'var(--text-primary)', fontWeight: 500, cursor: 'pointer' }}>Email</span>
          <span className="text-body" style={{ color: 'var(--text-disabled)', cursor: 'pointer' }}>LinkedIn</span>
          <span className="text-body" style={{ color: 'var(--text-disabled)', cursor: 'pointer' }}>Call</span>
        </div>

        <div style={{ backgroundColor: 'var(--bg-page)', padding: '16px', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
          <div className="text-caption" style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Subject: Systems for Greenfield Constructions</div>
          <p className="text-body">
            Hi Team,
            <br/><br/>
            Noticed you recently registered your new ABN and are looking for an office manager. Congratulations on the new venture!
            <br/><br/>
            We help construction businesses set up their digital presence and accounting software from day one so you don't inherit technical debt. 
            <br/><br/>
            Worth a quick 10 min chat next week?
          </p>
        </div>

        <button style={{ 
          backgroundColor: 'var(--color-emerald-600)', 
          color: '#fff', 
          border: 'none', 
          padding: '8px 16px', 
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: '13px'
        }}>
          Approve & Send Email
        </button>
      </div>
    </div>
  );
};
