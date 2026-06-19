import { useState, type FormEvent } from 'react';
import { useApp } from '../context/AppContext';

export default function Goals() {
  const { goals, addGoal, deleteGoal, updateGoalProgress, darkMode } = useApp();
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [unit, setUnit] = useState('');
  const [deadline, setDeadline] = useState('');
  const [editingId, setEditingId] = useState<string|null>(null);
  const [editVal, setEditVal] = useState('');

  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const cardBorder = darkMode ? '#334155' : '#e2e8f0';
  const subText = darkMode ? '#94a3b8' : '#64748b';
  const labelStyle = { fontSize:'0.78rem', fontWeight:600 as const, color:subText, textTransform:'uppercase' as const, letterSpacing:'0.04em', marginBottom:6, display:'block' as const };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addGoal({ title, target:parseFloat(target), current:parseFloat(current||'0'), unit, deadline });
    setTitle(''); setTarget(''); setCurrent(''); setUnit(''); setDeadline('');
  };

  const active = goals.filter(g => !g.completed);
  const done   = goals.filter(g => g.completed);

  return (
    <div>
      <div style={{ marginBottom:'2rem' }}>
        <h2 className="page-title">🎯 Fitness Goals</h2>
        <p style={{ color:subText, marginTop:4 }}>
          <strong style={{ color:'#f59e0b' }}>{active.length}</strong> active ·{' '}
          <strong style={{ color:'#10b981' }}>{done.length}</strong> completed
        </p>
      </div>

      {/* Add form */}
      <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:20, padding:'1.75rem', marginBottom:'2rem', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
        <h6 style={{ fontWeight:700, marginBottom:'1.25rem', color: darkMode ? '#f1f5f9' : '#0f172a' }}>➕ Set a New Goal</h6>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4"><label style={labelStyle}>Goal Title</label>
              <input type="text" className="ft-input form-control" placeholder="e.g. Run 5km" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="col-md-2"><label style={labelStyle}>Target</label>
              <input type="number" className="ft-input form-control" placeholder="5" value={target} onChange={e => setTarget(e.target.value)} required min="0" />
            </div>
            <div className="col-md-2"><label style={labelStyle}>Current</label>
              <input type="number" className="ft-input form-control" placeholder="0" value={current} onChange={e => setCurrent(e.target.value)} min="0" />
            </div>
            <div className="col-md-2"><label style={labelStyle}>Unit</label>
              <input type="text" className="ft-input form-control" placeholder="km / kg / min" value={unit} onChange={e => setUnit(e.target.value)} required />
            </div>
            <div className="col-md-2"><label style={labelStyle}>Deadline</label>
              <input type="date" className="ft-input form-control" value={deadline} onChange={e => setDeadline(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="btn btn-gradient-primary mt-3" style={{ padding:'0.6rem 2rem' }}>🎯 Add Goal</button>
        </form>
      </div>

      {goals.length === 0 ? (
        <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:20, padding:'4rem', textAlign:'center', color:subText, boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize:'3.5rem', marginBottom:12 }}>🎯</div>
          <p style={{ fontWeight:600, fontSize:'1rem' }}>No goals yet. Set your first one above!</p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div style={{ marginBottom:'2rem' }}>
              <h6 style={{ fontWeight:700, color: darkMode ? '#f1f5f9' : '#0f172a', marginBottom:'1rem' }}>🔥 In Progress</h6>
              <div className="row g-3">
                {active.map(g => {
                  const pct = Math.min(Math.round((g.current / g.target)*100), 100);
                  const daysLeft = Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000);
                  const expired = daysLeft < 0;
                  return (
                    <div key={g.id} className="col-md-6">
                      <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:20, padding:'1.5rem', boxShadow:'0 4px 20px rgba(0,0,0,0.05)', transition:'transform 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.transform='translateY(-3px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform='translateY(0)')}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h6 style={{ fontWeight:700, marginBottom:4, color: darkMode ? '#f1f5f9' : '#0f172a', fontSize:'0.95rem' }}>🎯 {g.title}</h6>
                            <span style={{ fontSize:'0.75rem', fontWeight:600, color: expired ? '#ef4444' : '#f59e0b', background: expired ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', padding:'3px 10px', borderRadius:50 }}>
                              {expired ? '⏰ Expired' : `📅 ${daysLeft}d left`}
                            </span>
                          </div>
                          <button onClick={() => deleteGoal(g.id)} style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444', border:'none', borderRadius:10, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'0.8rem' }}>🗑️</button>
                        </div>

                        <div style={{ marginBottom:'1rem' }}>
                          <div className="d-flex justify-content-between mb-1">
                            <span style={{ fontSize:'0.82rem', color:subText }}>{g.current} / {g.target} {g.unit}</span>
                            <span style={{ fontSize:'0.88rem', fontWeight:800, color:'#6366f1' }}>{pct}%</span>
                          </div>
                          <div style={{ height:10, borderRadius:100, background: darkMode ? '#0f172a' : '#f1f5f9', overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius:100, transition:'width 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
                          </div>
                        </div>

                        {editingId === g.id ? (
                          <div className="d-flex gap-2">
                            <input type="number" className="ft-input form-control form-control-sm" value={editVal} onChange={e => setEditVal(e.target.value)} min="0" style={{ maxWidth:120 }} />
                            <button onClick={() => { updateGoalProgress(g.id, parseFloat(editVal)); setEditingId(null); }} style={{ background:'linear-gradient(135deg,#10b981,#059669)', color:'#fff', border:'none', borderRadius:10, padding:'0.3rem 0.9rem', fontWeight:600, cursor:'pointer', fontSize:'0.82rem' }}>✓ Save</button>
                            <button onClick={() => setEditingId(null)} style={{ background:'none', color:subText, border:`1px solid ${cardBorder}`, borderRadius:10, padding:'0.3rem 0.7rem', cursor:'pointer', fontSize:'0.82rem' }}>✕</button>
                          </div>
                        ) : (
                          <button onClick={() => { setEditingId(g.id); setEditVal(g.current.toString()); }} style={{ background:'rgba(99,102,241,0.1)', color:'#6366f1', border:'none', borderRadius:10, padding:'0.4rem 1rem', fontWeight:600, cursor:'pointer', fontSize:'0.82rem' }}>
                            📝 Update Progress
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {done.length > 0 && (
            <div>
              <h6 style={{ fontWeight:700, color: darkMode ? '#f1f5f9' : '#0f172a', marginBottom:'1rem' }}>🏆 Achieved</h6>
              <div className="row g-3">
                {done.map(g => (
                  <div key={g.id} className="col-md-6">
                    <div style={{ background: darkMode ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.04)', border:'1.5px solid rgba(16,185,129,0.3)', borderRadius:20, padding:'1.25rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem' }}>
                      <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg, #10b981, #059669)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', boxShadow:'0 4px 15px rgba(16,185,129,0.35)' }}>🏆</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, color: darkMode ? '#f1f5f9' : '#0f172a', fontSize:'0.9rem' }}>{g.title}</div>
                        <div style={{ fontSize:'0.78rem', color:'#10b981', fontWeight:600 }}>{g.target} {g.unit} · Completed!</div>
                      </div>
                      <button onClick={() => deleteGoal(g.id)} style={{ background:'none', color:subText, border:'none', cursor:'pointer', fontSize:'0.85rem' }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
