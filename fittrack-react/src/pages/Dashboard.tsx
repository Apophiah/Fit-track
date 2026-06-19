import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { DashboardStats } from '../types';

const statCards = [
  { key: 'steps',     label: 'Steps Today',      icon: '👟', unit: '',     color: 'indigo',  bg: 'rgba(99,102,241,0.12)',  accent: '#6366f1' },
  { key: 'calories',  label: 'Calories Burned',  icon: '🔥', unit: 'kcal', color: 'emerald', bg: 'rgba(16,185,129,0.12)', accent: '#10b981' },
  { key: 'distance',  label: 'Distance',         icon: '🚀', unit: 'km',   color: 'cyan',    bg: 'rgba(6,182,212,0.12)',  accent: '#06b6d4' },
  { key: 'heartRate', label: 'Heart Rate',        icon: '❤️', unit: 'bpm',  color: 'rose',    bg: 'rgba(239,68,68,0.12)', accent: '#ef4444' },
] as const;

const quickNav = [
  { title: 'Workouts',  icon: '🏋️', desc: 'Log & track exercises',      link: '/workouts',  color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
  { title: 'Nutrition', icon: '🥗', desc: 'Meals & calorie tracking',   link: '/nutrition', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { title: 'Progress',  icon: '📈', desc: 'Weekly charts & trends',     link: '/progress',  color: '#06b6d4', bg: 'rgba(6,182,212,0.1)'   },
  { title: 'Goals',     icon: '🎯', desc: 'Set & track your targets',   link: '/goals',     color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  { title: 'Community', icon: '💬', desc: 'Share & connect with others',link: '/community', color: '#a855f7', bg: 'rgba(168,85,247,0.1)'  },
  { title: 'Profile',   icon: '👤', desc: 'Manage your account',        link: '/profile',   color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
];

function CircleProgress({ value, max, color, size = 80 }: { value: number; max: number; color: string; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const offset = circ * (1 - pct);
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.9)"
          strokeWidth={8} strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <span className="ring-label" style={{ color: '#fff', fontSize: size * 0.18 }}>
        {Math.round(pct * 100)}%
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { stats, saveStats, currentUser, workouts, meals, goals, darkMode } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<DashboardStats>(stats);

  const handleSave = () => { saveStats(form); setEditing(false); };

  const today = new Date().toISOString().split('T')[0];
  const todayWorkouts = workouts.filter(w => w.date === today);
  const todayMeals = meals.filter(m => m.date === today);
  const todayCalIn = todayMeals.reduce((s, m) => s + m.calories, 0);
  const activeGoals = goals.filter(g => !g.completed).length;
  const completedGoals = goals.filter(g => g.completed).length;

  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const cardBorder = darkMode ? '#334155' : '#e2e8f0';
  const subText = darkMode ? '#94a3b8' : '#64748b';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      {/* ── Hero Banner ── */}
      <div
        className="fade-up"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 60%, #10b981 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 8s ease infinite',
          borderRadius: 24,
          padding: '2.5rem 2rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <div style={{ position:'absolute', top:-60, right:-60, width:250, height:250, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }} />
        <div style={{ position:'absolute', bottom:-80, left:-40, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3" style={{ position:'relative', zIndex:1 }}>
          <div>
            <p style={{ color:'rgba(255,255,255,0.8)', fontWeight:500, marginBottom:4, fontSize:'0.95rem' }}>
              {greeting()}, 👋
            </p>
            <h1 style={{ color:'#fff', fontWeight:900, fontSize:'clamp(1.6rem,4vw,2.4rem)', marginBottom:8 }}>
              {currentUser}
            </h1>
            <p style={{ color:'rgba(255,255,255,0.75)', marginBottom:0, fontSize:'0.95rem' }}>
              {todayWorkouts.length > 0
                ? `🔥 You crushed ${todayWorkouts.length} workout${todayWorkouts.length > 1 ? 's' : ''} today!`
                : "Let's make today count! 💪"}
            </p>
          </div>
          <div className="d-flex gap-4 flex-wrap">
            {[
              { label: 'Workouts', val: todayWorkouts.length, icon:'🏋️' },
              { label: 'Meals', val: todayMeals.length, icon:'🥗' },
              { label: 'Goals', val: `${completedGoals}/${goals.length}`, icon:'🎯' },
            ].map((s,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.7)', marginBottom:2 }}>{s.icon} {s.label}</div>
                <div style={{ fontSize:'1.8rem', fontWeight:800, color:'#fff', lineHeight:1 }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="row g-3 mb-4">
        {statCards.map((c, i) => (
          <div key={c.key} className={`col-6 col-md-3 fade-up delay-${i+1}`}>
            <div className={`stat-card ${c.color}`}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <p style={{ color:'rgba(255,255,255,0.75)', fontWeight:500, marginBottom:6, fontSize:'0.82rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                    {c.label}
                  </p>
                  <div style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:900, color:'#fff', lineHeight:1 }}>
                    {c.key === 'steps' ? stats.steps.toLocaleString() : stats[c.key]}
                    {c.unit && <span style={{ fontSize:'0.75rem', fontWeight:500, marginLeft:4, opacity:0.8 }}>{c.unit}</span>}
                  </div>
                </div>
                <div style={{ fontSize:'2rem', opacity:0.9, position:'relative', zIndex:2 }}>{c.icon}</div>
              </div>
              <div style={{ marginTop:'1rem' }}>
                <CircleProgress
                  value={stats[c.key]}
                  max={c.key === 'steps' ? 10000 : c.key === 'calories' ? 700 : c.key === 'distance' ? 10 : 120}
                  color={c.accent}
                  size={60}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Today Summary Row ── */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Calories In', value: `${todayCalIn}`, sub:'kcal consumed today', icon:'🍽️', color:'#f59e0b', bg:'rgba(245,158,11,0.12)' },
          { label: 'Active Goals', value: `${activeGoals}`, sub:'goals in progress', icon:'🎯', color:'#a855f7', bg:'rgba(168,85,247,0.12)' },
          { label: 'Completed', value: `${completedGoals}`, sub:'goals achieved', icon:'🏆', color:'#10b981', bg:'rgba(16,185,129,0.12)' },
        ].map((item, i) => (
          <div key={i} className={`col-md-4 fade-up delay-${i+1}`}>
            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: '1.25rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem', boxShadow:'0 2px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ width:52, height:52, borderRadius:14, background: item.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize:'1.6rem', fontWeight:800, color: item.color, lineHeight:1 }}>{item.value}</div>
                <div style={{ fontSize:'0.82rem', color:subText, fontWeight:500, marginTop:2 }}>{item.label}</div>
                <div style={{ fontSize:'0.75rem', color:subText }}>{item.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Update Stats ── */}
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1rem' }}>
        <button
          className="btn btn-sm"
          onClick={() => setEditing(!editing)}
          style={{
            borderRadius: 12, fontWeight: 600, fontSize: '0.85rem',
            background: editing ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
            color: editing ? '#ef4444' : '#6366f1',
            border: `1px solid ${editing ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)'}`,
            padding: '0.45rem 1.1rem',
          }}
        >
          {editing ? '✕ Cancel' : '⚙️ Update Stats'}
        </button>
      </div>

      {editing && (
        <div
          className="fade-up mb-4"
          style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
        >
          <h6 style={{ fontWeight:700, marginBottom:'1rem', color: darkMode ? '#f1f5f9' : '#0f172a' }}>📊 Update Today's Stats</h6>
          <div className="row g-3">
            {[
              { field: 'steps',     label: 'Steps',             step: '1',   placeholder: '8000' },
              { field: 'calories',  label: 'Calories Burned',   step: '1',   placeholder: '500' },
              { field: 'distance',  label: 'Distance (km)',     step: '0.1', placeholder: '5.0' },
              { field: 'heartRate', label: 'Heart Rate (bpm)',  step: '1',   placeholder: '75' },
            ].map(f => (
              <div key={f.field} className="col-6 col-md-3">
                <label style={{ fontSize:'0.8rem', fontWeight:600, color:subText, marginBottom:4, display:'block', textTransform:'uppercase', letterSpacing:'0.04em' }}>
                  {f.label}
                </label>
                <input
                  type="number"
                  className="ft-input form-control"
                  step={f.step}
                  placeholder={f.placeholder}
                  value={form[f.field as keyof DashboardStats]}
                  onChange={e => setForm({ ...form, [f.field]: parseFloat(e.target.value) })}
                />
              </div>
            ))}
          </div>
          <button className="btn btn-gradient-success mt-3" style={{ padding:'0.55rem 2rem' }} onClick={handleSave}>
            💾 Save Stats
          </button>
        </div>
      )}

      {/* ── Quick Navigation ── */}
      <div style={{ marginBottom:'1.5rem' }}>
        <h5 style={{ fontWeight:800, color: darkMode ? '#f1f5f9' : '#0f172a', marginBottom:'1rem', fontSize:'1.05rem' }}>
          Quick Access
        </h5>
        <div className="row g-3">
          {quickNav.map((item, i) => (
            <div key={i} className={`col-6 col-md-4 fade-up delay-${(i % 4) + 1}`}>
              <Link to={item.link} style={{ textDecoration:'none' }}>
                <div
                  className="nav-icon-card"
                  style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: item.bg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 0.75rem',
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ fontWeight: 700, color: darkMode ? '#f1f5f9' : '#0f172a', marginBottom: 2, fontSize:'0.92rem' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: subText }}>
                    {item.desc}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="row g-3">
        <div className="col-md-6">
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 style={{ fontWeight:700, margin:0, color: darkMode ? '#f1f5f9' : '#0f172a' }}>🏋️ Recent Workouts</h6>
              <Link to="/workouts" style={{ fontSize:'0.8rem', color:'#6366f1', fontWeight:600, textDecoration:'none' }}>View all →</Link>
            </div>
            {workouts.length === 0 ? (
              <div style={{ textAlign:'center', padding:'2rem 0', color:subText }}>
                <div style={{ fontSize:'2.5rem', marginBottom:8 }}>🏃</div>
                <p style={{ fontSize:'0.85rem', margin:0 }}>No workouts yet. Start moving!</p>
              </div>
            ) : (
              [...workouts].slice(-4).reverse().map(w => (
                <div key={w.id} className="list-item-hover d-flex align-items-center gap-3 p-2">
                  <div style={{ width:38, height:38, borderRadius:10, background:'rgba(99,102,241,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>
                    {w.type === 'Cardio' ? '🏃' : w.type === 'Strength' ? '💪' : w.type === 'HIIT' ? '⚡' : w.type === 'Yoga' ? '🧘' : '🤸'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:'0.88rem', color: darkMode ? '#f1f5f9' : '#0f172a' }}>{w.type}</div>
                    <div style={{ fontSize:'0.75rem', color:subText }}>{w.date} · {w.duration} min</div>
                  </div>
                  <span style={{ fontSize:'0.75rem', fontWeight:600, color:'#6366f1', background:'rgba(99,102,241,0.1)', padding:'2px 10px', borderRadius:50 }}>{w.type}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 style={{ fontWeight:700, margin:0, color: darkMode ? '#f1f5f9' : '#0f172a' }}>🎯 Active Goals</h6>
              <Link to="/goals" style={{ fontSize:'0.8rem', color:'#6366f1', fontWeight:600, textDecoration:'none' }}>View all →</Link>
            </div>
            {goals.length === 0 ? (
              <div style={{ textAlign:'center', padding:'2rem 0', color:subText }}>
                <div style={{ fontSize:'2.5rem', marginBottom:8 }}>🎯</div>
                <p style={{ fontSize:'0.85rem', margin:0 }}>No goals set. Add your first one!</p>
              </div>
            ) : (
              goals.slice(0, 4).map(g => {
                const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
                return (
                  <div key={g.id} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span style={{ fontWeight:600, fontSize:'0.85rem', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                        {g.completed ? '✅' : '🎯'} {g.title}
                      </span>
                      <span style={{ fontSize:'0.78rem', fontWeight:700, color: g.completed ? '#10b981' : '#6366f1' }}>{pct}%</span>
                    </div>
                    <div className="ft-progress">
                      <div
                        className="ft-progress-bar"
                        style={{
                          width:`${pct}%`,
                          background: g.completed
                            ? 'linear-gradient(90deg, #10b981, #059669)'
                            : 'linear-gradient(90deg, #6366f1, #06b6d4)',
                        }}
                      />
                    </div>
                    <div style={{ fontSize:'0.72rem', color:subText, marginTop:2 }}>
                      {g.current} / {g.target} {g.unit}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
