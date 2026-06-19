import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const { profile, saveProfile, darkMode, currentUser } = useApp();
  const [fullName, setFullName] = useState(profile.fullName || currentUser || '');
  const [email, setEmail] = useState(profile.email);
  const [goal, setGoal] = useState(profile.goal);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [age, setAge] = useState(profile.age?.toString() || '');
  const [weight, setWeight] = useState(profile.weight?.toString() || '');
  const [height, setHeight] = useState(profile.height?.toString() || '');
  const [toast, setToast] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');

  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const cardBorder = darkMode ? '#334155' : '#e2e8f0';
  const subText = darkMode ? '#94a3b8' : '#64748b';
  const labelStyle = { fontSize:'0.78rem', fontWeight:600 as const, color:subText, textTransform:'uppercase' as const, letterSpacing:'0.04em', marginBottom:6, display:'block' as const };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    saveProfile({ fullName, email, goal, avatar, age:age?parseInt(age):undefined, weight:weight?parseFloat(weight):undefined, height:height?parseFloat(height):undefined });
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handlePw = (e: FormEvent) => {
    e.preventDefault();
    setPwError('');
    const saved = localStorage.getItem('fittrack_password');
    if (saved && currentPw !== saved) { setPwError('Current password is incorrect.'); return; }
    if (newPw.length < 6) { setPwError('Min. 6 characters.'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match.'); return; }
    localStorage.setItem('fittrack_password', newPw);
    setShowPwModal(false); setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setToast(true); setTimeout(() => setToast(false), 3000);
  };

  const bmi = weight && height ? (parseFloat(weight) / Math.pow(parseFloat(height)/100, 2)).toFixed(1) : null;
  const bmiVal = bmi ? parseFloat(bmi) : 0;
  const bmiLabel = !bmi ? '' : bmiVal < 18.5 ? 'Underweight' : bmiVal < 25 ? 'Normal' : bmiVal < 30 ? 'Overweight' : 'Obese';
  const bmiColor = !bmi ? '' : bmiVal < 18.5 ? '#06b6d4' : bmiVal < 25 ? '#10b981' : bmiVal < 30 ? '#f59e0b' : '#ef4444';

  return (
    <div>
      <div style={{ marginBottom:'2rem' }}>
        <h2 className="page-title">👤 My Profile</h2>
        <p style={{ color:subText, marginTop:4 }}>Manage your account and fitness preferences.</p>
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:24, padding:'2rem', boxShadow:'0 8px 40px rgba(0,0,0,0.06)' }}>
            {/* Avatar */}
            <div style={{ textAlign:'center', marginBottom:'2rem' }}>
              <div style={{ position:'relative', display:'inline-block' }}>
                <img
                  src={avatar || `https://ui-avatars.com/api/?name=${fullName || 'User'}&background=6366f1&color=fff&size=110`}
                  alt="Avatar"
                  style={{ width:110, height:110, borderRadius:'50%', objectFit:'cover', border:'4px solid #6366f1', boxShadow:'0 0 0 6px rgba(99,102,241,0.15)' }}
                />
              </div>
              <div style={{ marginTop:'0.75rem' }}>
                <label style={{ display:'inline-block', cursor:'pointer', background:'rgba(99,102,241,0.1)', color:'#6366f1', border:'1px solid rgba(99,102,241,0.25)', borderRadius:10, padding:'0.4rem 1.25rem', fontWeight:600, fontSize:'0.82rem' }}>
                  📷 Change Photo
                  <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display:'none' }} />
                </label>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6"><label style={labelStyle}>Full Name</label>
                  <input type="text" className="ft-input form-control" value={fullName} onChange={e => setFullName(e.target.value)} required />
                </div>
                <div className="col-md-6"><label style={labelStyle}>Email Address</label>
                  <input type="email" className="ft-input form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="col-md-4"><label style={labelStyle}>Age</label>
                  <input type="number" className="ft-input form-control" value={age} onChange={e => setAge(e.target.value)} placeholder="25" min="1" max="120" />
                </div>
                <div className="col-md-4"><label style={labelStyle}>Weight (kg)</label>
                  <input type="number" step="0.1" className="ft-input form-control" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" min="0" />
                </div>
                <div className="col-md-4"><label style={labelStyle}>Height (cm)</label>
                  <input type="number" className="ft-input form-control" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" min="0" />
                </div>
                <div className="col-12"><label style={labelStyle}>Fitness Goal</label>
                  <select className="ft-input form-select" value={goal} onChange={e => setGoal(e.target.value)} required>
                    <option value="">-- Select --</option>
                    {['Lose Weight','Gain Muscle','Stay Fit','Build Endurance','Improve Flexibility'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="d-flex gap-3 mt-4 flex-wrap">
                <button type="submit" className="btn btn-gradient-primary" style={{ padding:'0.65rem 2rem' }}>💾 Save Profile</button>
                <button type="button" onClick={() => setShowPwModal(true)} style={{ background:'none', color:'#6366f1', border:'1.5px solid rgba(99,102,241,0.35)', borderRadius:12, padding:'0.65rem 1.5rem', fontWeight:600, cursor:'pointer', fontSize:'0.88rem' }}>🔐 Change Password</button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-md-4">
          {/* BMI Card */}
          {bmi && (
            <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:20, padding:'1.5rem', marginBottom:'1rem', textAlign:'center', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
              <h6 style={{ fontWeight:700, marginBottom:'1rem', color: darkMode ? '#f1f5f9' : '#0f172a' }}>⚖️ BMI</h6>
              <div style={{ fontSize:'3rem', fontWeight:900, color:bmiColor, lineHeight:1 }}>{bmi}</div>
              <span style={{ display:'inline-block', marginTop:8, padding:'4px 16px', borderRadius:50, background:`${bmiColor}22`, color:bmiColor, fontWeight:700, fontSize:'0.85rem' }}>{bmiLabel}</span>
              <p style={{ color:subText, fontSize:'0.78rem', marginTop:10, marginBottom:0 }}>{weight}kg · {height}cm</p>
            </div>
          )}

          {/* Account info */}
          <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:20, padding:'1.5rem', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
            <h6 style={{ fontWeight:700, marginBottom:'1rem', color: darkMode ? '#f1f5f9' : '#0f172a' }}>📋 Account</h6>
            {[
              { label:'Username', val: currentUser || '-' },
              { label:'Goal', val: goal || 'Not set' },
              { label:'Age', val: age ? `${age} years` : '-' },
              { label:'Member since', val: '2025' },
            ].map((r, i, arr) => (
              <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'0.5rem 0', borderBottom: i < arr.length - 1 ? `1px solid ${cardBorder}` : 'none' }}>
                <span style={{ fontSize:'0.82rem', color:subText, fontWeight:500 }}>{r.label}</span>
                <span style={{ fontSize:'0.82rem', fontWeight:700, color: darkMode ? '#f1f5f9' : '#0f172a' }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPwModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, backdropFilter:'blur(4px)' }}>
          <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:24, padding:'2rem', width:'100%', maxWidth:420, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
            <h5 style={{ fontWeight:800, marginBottom:'1.25rem', color: darkMode ? '#f1f5f9' : '#0f172a' }}>🔐 Change Password</h5>
            {pwError && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, padding:'0.65rem 1rem', marginBottom:'1rem', color:'#ef4444', fontSize:'0.85rem' }}>⚠️ {pwError}</div>}
            <form onSubmit={handlePw}>
              {[
                { label:'Current Password', val:currentPw, set:setCurrentPw },
                { label:'New Password', val:newPw, set:setNewPw },
                { label:'Confirm New Password', val:confirmPw, set:setConfirmPw },
              ].map(f => (
                <div key={f.label} style={{ marginBottom:'1rem' }}>
                  <label style={labelStyle}>{f.label}</label>
                  <input type="password" className="ft-input form-control" value={f.val} onChange={e => f.set(e.target.value)} required />
                </div>
              ))}
              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-gradient-success flex-grow-1" style={{ padding:'0.65rem' }}>Update</button>
                <button type="button" onClick={() => setShowPwModal(false)} style={{ background:'none', color:subText, border:`1px solid ${cardBorder}`, borderRadius:12, padding:'0.65rem 1.2rem', cursor:'pointer', fontWeight:600 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, background:'linear-gradient(135deg,#10b981,#059669)', color:'#fff', borderRadius:14, padding:'0.85rem 1.5rem', fontWeight:600, boxShadow:'0 8px 30px rgba(16,185,129,0.45)', animation:'fadeUp 0.3s ease' }}>
          ✅ Saved successfully!
        </div>
      )}
    </div>
  );
}
