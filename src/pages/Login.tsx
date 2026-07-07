import { useState } from 'react';
import { IconRadar, IconUser, IconLock, IconLogin, IconShieldCheck } from '@tabler/icons-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = '/';
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      background: 'radial-gradient(circle at top right, #1e1b4b, #030712)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#fff',
      fontFamily: 'var(--font-display, sans-serif)'
    }}>
      {/* Background Decorative Elements */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'var(--color-primary)', filter: 'blur(150px)', opacity: 0.1, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: '#06b6d4', filter: 'blur(150px)', opacity: 0.05, pointerEvents: 'none' }}></div>

      <div className="glass-panel" style={{ 
        width: '420px', 
        padding: '48px', 
        borderRadius: '24px', 
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #06b6d4 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 0 30px rgba(79, 70, 229, 0.4)'
          }}>
            <IconRadar size={32} color="#fff" stroke={1.5} />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>LogikSense</h2>
          <p style={{ color: 'var(--text-disabled)', fontSize: '14px', margin: 0 }}>Intelligence Engine V4.5 Enterprise</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Corporate Email</label>
            <div style={{ position: 'relative' }}>
              <IconUser size={18} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '14px 16px 14px 48px', 
                  background: 'rgba(0,0,0,0.3)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '15px'
                }} 
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Key</label>
            <div style={{ position: 'relative' }}>
              <IconLock size={18} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '14px 16px 14px 48px', 
                  background: 'rgba(0,0,0,0.3)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '15px'
                }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="remember" style={{ accentColor: 'var(--color-primary)' }} />
              <label htmlFor="remember" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>MFA Secured Session</label>
            </div>
            <a href="#" style={{ fontSize: '13px', color: 'var(--color-primary)', textDecoration: 'none' }}>Access Help</a>
          </div>

          <button 
            type="submit"
            className="btn-primary"
            style={{ 
              padding: '16px', 
              borderRadius: '12px', 
              fontSize: '16px', 
              fontWeight: 600, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px',
              cursor: 'pointer',
              border: 'none',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #6366f1 100%)',
              color: '#fff'
            }}
          >
            <IconLogin size={20} />
            Authenticate Session
          </button>
        </form>

        <div style={{ 
          marginTop: '32px', 
          padding: '16px', 
          background: 'rgba(52, 211, 153, 0.05)', 
          borderRadius: '12px', 
          border: '1px solid rgba(52, 211, 153, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <IconShieldCheck size={20} color="#34d399" />
          <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 500 }}>Bank-grade encryption active. Verified IP detected.</span>
        </div>
      </div>
    </div>
  );
};
