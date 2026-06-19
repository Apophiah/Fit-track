import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login, darkMode } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const cardBorder = darkMode ? '#334155' : '#e2e8f0';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const ok = login(username.trim(), password.trim());
    setLoading(false);
    if (ok) navigate('/dashboard');
    else setError('Invalid username or password.');
  };

  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="fade-up" style={{ width:'100%', maxWidth:420 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{
            width:70, height:70, borderRadius:20,
            background:'linear-gradient(135deg, #6366f1, #06b6d4)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'2rem', margin:'0 auto 1rem',
            boxShadow:'0 8px 30px rgba(99,102,241,0.4)',
          }}>💪</div>
          <h2 style={{ fontWeight:900, color: darkMode ? '#f1f5f9' : '#0f172a', marginBottom:4 }}>Welcome back</h2>
          <p style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize:'0.9rem' }}>Sign in to your FitTrack account</p>
        </div>

        <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:24, padding:'2rem', boxShadow:'0 8px 40px rgba(0,0,0,0.08)' }}>
          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:12, padding:'0.75rem 1rem', marginBottom:'1rem', color:'#ef4444', fontSize:'0.88rem', fontWeight:500 }}>
              ⚠️ {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:'1rem' }}>
              <label style={{ fontSize:'0.82rem', fontWeight:600, color: darkMode ? '#94a3b8' : '#64748b', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6, display:'block' }}>Username</label>
              <input type="text" className="ft-input form-control" placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div style={{ marginBottom:'1.5rem' }}>
              <label style={{ fontSize:'0.82rem', fontWeight:600, color: darkMode ? '#94a3b8' : '#64748b', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6, display:'block' }}>Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPass ? 'text' : 'password'} className="ft-input form-control" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight:'3rem' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'1rem' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-gradient-primary w-100" style={{ padding:'0.8rem', fontSize:'0.95rem' }} disabled={loading}>
              {loading ? '⏳ Signing in...' : '→ Sign In'}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:'1.25rem', marginBottom:0, fontSize:'0.88rem', color: darkMode ? '#94a3b8' : '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color:'#6366f1', fontWeight:700, textDecoration:'none' }}>Create one →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
