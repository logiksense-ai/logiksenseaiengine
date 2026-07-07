import { NavLink } from 'react-router-dom';
import { 
  IconLayoutDashboard, 
  IconUsers,
  IconTarget, 
  IconActivity, 
  IconRobot, 
  IconSettings,
  IconRadar,
  IconSearch,
  IconMail,
  IconSparkles,
  IconBrandLinkedin,
  IconInbox,
  IconStack2,
  IconShieldCheck,
  IconLayoutColumns,
  IconChartBar,
  IconLogout
} from '@tabler/icons-react';

const intelligenceItems = [
  { icon: IconLayoutDashboard, label: 'Dashboard',    route: '/' },
  { icon: IconUsers,           label: 'Leads',        route: '/leads' },
  { icon: IconChartBar,        label: 'Analytics',    route: '/analytics' },
  { icon: IconSearch,          label: 'Research',      route: '/research' },
  { icon: IconTarget,          label: 'ICP Builder',   route: '/icp' },
  { icon: IconRadar,           label: 'AI Scraper',    route: '/scraper' },
  { icon: IconActivity,        label: 'Signals',      route: '/signals' },
];

const marketingItems = [
  { icon: IconSparkles,         label: 'Engagement',   route: '/engagement' },
  { icon: IconMail,            label: 'Campaigns',    route: '/campaigns' },
  { icon: IconStack2,          label: 'Sequences',    route: '/sequences' },
  { icon: IconInbox,           label: 'Inbox',        route: '/inbox' },
];

const salesItems = [
  { icon: IconBrandLinkedin,   label: 'LinkedIn',     route: '/linkedin' },
  { icon: IconLayoutColumns,   label: 'Pipeline',     route: '/pipeline' },
];

const engineItems = [
  { icon: IconRobot,           label: 'AI Agents',    route: '/agents' },
  { icon: IconActivity,        label: 'Audit Log',     route: '/audit' },
  { icon: IconShieldCheck,     label: 'Compliance',   route: '/compliance' },
  { icon: IconSettings,        label: 'Settings',     route: '/settings' },
];

export const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  };

  return (
    <div className="sidebar" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      background: 'var(--bg-card)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      width: '240px'
    }}>
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #06b6d4 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(79, 70, 229, 0.4)'
        }}>
          <IconRadar size={18} color="#fff" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>LogikSense</span>
          <span style={{ fontSize: '10px', color: 'var(--color-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Intelligence Engine</span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-disabled)', padding: '0 12px 10px 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Intelligence</div>
        {intelligenceItems.map((item) => (
          <NavLink key={item.route} to={item.route} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ textDecoration: 'none', marginBottom: '2px' }}>
            <item.icon size={18} stroke={1.5} />
            {item.label}
          </NavLink>
        ))}

        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-disabled)', padding: '20px 12px 10px 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Digital Marketing</div>
        {marketingItems.map((item) => (
          <NavLink key={item.route} to={item.route} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ textDecoration: 'none', marginBottom: '2px' }}>
            <item.icon size={18} stroke={1.5} />
            {item.label}
          </NavLink>
        ))}

        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-disabled)', padding: '20px 12px 10px 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sales Execution</div>
        {salesItems.map((item) => (
          <NavLink key={item.route} to={item.route} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ textDecoration: 'none', marginBottom: '2px' }}>
            <item.icon size={18} stroke={1.5} />
            {item.label}
          </NavLink>
        ))}

        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-disabled)', padding: '20px 12px 10px 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Core Engine</div>
        {engineItems.map((item) => (
          <NavLink key={item.route} to={item.route} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ textDecoration: 'none', marginBottom: '2px' }}>
            <item.icon size={18} stroke={1.5} />
            {item.label}
          </NavLink>
        ))}

        <div 
          onClick={handleLogout}
          className="nav-item" 
          style={{ textDecoration: 'none', marginTop: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <IconLogout size={18} stroke={1.5} />
          Logout Terminal
        </div>
      </nav>

      {/* Agent Heartbeat Strip */}
      <div style={{ 
        padding: '16px 20px', 
        background: 'rgba(0,0,0,0.2)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="agent-dot active"></div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>LOGIK SWARM ACTIVE</span>
        </div>
        <div style={{ display: 'flex', gap: '3px' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ width: '3px', height: '10px', borderRadius: '1px', backgroundColor: 'var(--color-primary)', opacity: 0.3 + (i * 0.1) }} />
          ))}
        </div>
      </div>
    </div>
  );
};
