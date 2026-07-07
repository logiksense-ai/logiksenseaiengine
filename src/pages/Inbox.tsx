import type { FC } from 'react';
import { IconInbox, IconMessageDots } from '@tabler/icons-react';

export const Inbox: FC = () => {
  return (
    <div className="page-container" style={{ padding: '30px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Unified Inbox</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage responses from Email and LinkedIn in one place.</p>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '20px', height: 'calc(100vh - 200px)' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '15px' }}>
            <input 
              type="text" 
              placeholder="Search conversations..." 
              style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'white' }}
            />
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-disabled)' }}>
            <p>No messages yet</p>
          </div>
        </div>
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <IconMessageDots size={48} style={{ color: 'var(--text-disabled)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Select a conversation to start chatting</p>
        </div>
      </div>
    </div>
  );
};