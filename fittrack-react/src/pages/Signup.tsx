import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Signup() {
  const { signup, darkMode } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const cardBorder = darkMode ? '#334155' : '#e2e8f0';

  const strengthScore = password.length >= 8 ? (password.match(/[A-Z]/) ? 1 : 0) + (password.match(/[0-9]/) ? 1 : 0) + (password.match(/[^A-Za-z0-9]/) ? 1 : 0) + 1 : password.length >= 6 ? 1 : 0;
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strengthScore];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#06b6d4', '#10b981'][strengthScore];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const ok = signup(name.trim(), username.trim(), password.trim());
    setLoading(false);
    if (ok) navigate('/login');
    else setError('Username already taken. Choose a different one.');
  };

  const inputLabel = (text: string) => (
    <label style={{ fontSize:'0.82rem', fontWeight:600, color: darkMode ? '#94a3b8' : '#64748b', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6, display:'block' }}>{text}</label>
  );

  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="fade-up" style={{ width:'100%', maxWidth:440 }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ width:70, height:70, borderRadius:20, background:'linear-gradient(135deg, #10b981, #06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', margin:'0 auto 1rem', boxShadow:'0 8px 30px rgba(16,185,129,0.4)' }}>🏃</div>
          <h2 style={{ fontWeight:900, color: darkMode ? '#f1f5f9' : '#0f172a', marginBottom:4 }}>Create Account</h2>
          <p style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize:'0.9rem' }}>Join thousands of fitness enthusiasts</p>
        </div>

        <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:24, padding:'2rem', boxShadow:'0 8px 40px rgba(0,0,0,0.08)' }}>
          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:12, padding:'0.75rem 1rem', marginBottom:'1rem', color:'#ef4444', fontSize:'0.88rem', fontWeight:500 }}>
              ⚠️ {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:'1rem' }}>
              {inputLabel('Full Name')}
              <input type="text" className="ft-input form-control" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div style={{ marginBottom:'1rem' }}>
              {inputLabel('Username')}
              <input type="text" className="ft-input form-control" placeholder="johndoe123" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div style={{ marginBottom:'1rem' }}>
              {inputLabel('Password')}
              <div style={{ position:'relative' }}>
                <input type={showPass ? 'text' : 'password'} className="ft-input form-control" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight:'3rem' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'1rem' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {password && (
                <div style={{ marginTop:6 }}>
                  <div style={{ height:4, borderRadius:100, background:'#e2e8f0', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${strengthScore * 25}%`, background:strengthColor, borderRadius:100, transition:'width 0.3s, background 0.3s' }} />
                  </div>
                  <span style={{ fontSize:'0.75rem', color:strengthColor, fontWeight:600 }}>{strengthLabel}</span>
                </div>
              )}
            </div>
            <div style={{ marginBottom:'1.5rem' }}>
              {inputLabel('Confirm Password')}
              <input type="password" className="ft-input form-control" placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
              {confirm && password !== confirm && (
                <p style={{ fontSize:'0.78rem', color:'#ef4444', marginTop:4, marginBottom:0 }}>Passwords don't match</p>
              )}
            </div>
            <button type="submit" className="btn btn-gradient-success w-100" style={{ padding:'0.8rem', fontSize:'0.95rem' }} disabled={loading}>
              {loading ? '⏳ Creating...' : '🚀 Create Account'}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:'1.25rem', marginBottom:0, fontSize:'0.88rem', color: darkMode ? '#94a3b8' : '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#6366f1', fontWeight:700, textDecoration:'none' }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
