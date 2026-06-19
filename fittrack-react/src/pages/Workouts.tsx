import { useState, type FormEvent } from 'react';
import { useApp } from '../context/AppContext';
import type { Workout } from '../types';

type WT = Workout['type'];
const TYPES: WT[] = ['Cardio','Strength','Flexibility','HIIT','Yoga'];
const TYPE_META: Record<WT, { icon:string; color:string; bg:string }> = {
  Cardio:      { icon:'🏃', color:'#06b6d4', bg:'rgba(6,182,212,0.1)'   },
  Strength:    { icon:'💪', color:'#6366f1', bg:'rgba(99,102,241,0.1)'  },
  Flexibility: { icon:'🤸', color:'#10b981', bg:'rgba(16,185,129,0.1)'  },
  HIIT:        { icon:'⚡', color:'#ef4444', bg:'rgba(239,68,68,0.1)'   },
  Yoga:        { icon:'🧘', color:'#a855f7', bg:'rgba(168,85,247,0.1)'  },
};

export default function Workouts() {
  const { workouts, addWorkout, deleteWorkout, darkMode } = useApp();
  const [type, setType] = useState<WT | ''>('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [filterType, setFilterType] = useState('');
  const [search, setSearch] = useState('');

  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const cardBorder = darkMode ? '#334155' : '#e2e8f0';
  const subText = darkMode ? '#94a3b8' : '#64748b';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!type) return;
    addWorkout({ type, date, duration: parseInt(duration), notes });
    setType(''); setDate(''); setDuration(''); setNotes('');
  };

  const filtered = workouts
    .filter(w => !filterType || w.type === filterType)
    .filter(w => !search || w.type.toLowerCase().includes(search.toLowerCase()) || w.notes.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => b.date.localeCompare(a.date));

  const totalMin = workouts.reduce((s,w) => s + w.duration, 0);
  const totalHours = (totalMin / 60).toFixed(1);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:'2rem' }}>
        <h2 className="page-title">🏋️ Workout Tracker</h2>
        <p style={{ color:subText, marginTop:4 }}>
          <strong style={{ color:'#6366f1' }}>{workouts.length}</strong> workouts ·{' '}
          <strong style={{ color:'#10b981' }}>{totalHours}h</strong> total training
        </p>
      </div>

      {/* Stats row */}
      <div className="row g-3 mb-4">
        {TYPES.map(t => {
          const count = workouts.filter(w => w.type === t).length;
          const m = TYPE_META[t];
          return (
            <div key={t} className="col-6 col-md-2-4" style={{ flex:'0 0 20%', maxWidth:'20%' }}>
              <div
                style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:'1rem', textAlign:'center', cursor:'pointer', transition:'all 0.2s', boxShadow: filterType===t ? `0 0 0 2px ${m.color}` : 'none' }}
                onClick={() => setFilterType(filterType === t ? '' : t)}
                onMouseEnter={e => (e.currentTarget.style.transform='translateY(-3px)')}
                onMouseLeave={e => (e.currentTarget.style.transform='translateY(0)')}
              >
                <div style={{ fontSize:'1.5rem', marginBottom:4 }}>{m.icon}</div>
                <div style={{ fontWeight:700, fontSize:'1.1rem', color:m.color }}>{count}</div>
                <div style={{ fontSize:'0.72rem', color:subText, fontWeight:500 }}>{t}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add form */}
      <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:20, padding:'1.75rem', marginBottom:'1.5rem', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
        <h6 style={{ fontWeight:700, marginBottom:'1.25rem', color: darkMode ? '#f1f5f9' : '#0f172a', fontSize:'0.95rem' }}>
          ➕ Log New Workout
        </h6>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-3">
              <label style={{ fontSize:'0.78rem', fontWeight:600, color:subText, textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:6, display:'block' }}>Type</label>
              <select className="ft-input form-select" value={type} onChange={e => setType(e.target.value as WT)} required>
                <option value="">Choose...</option>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label style={{ fontSize:'0.78rem', fontWeight:600, color:subText, textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:6, display:'block' }}>Date</label>
              <input type="date" className="ft-input form-control" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="col-md-2">
              <label style={{ fontSize:'0.78rem', fontWeight:600, color:subText, textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:6, display:'block' }}>Duration (min)</label>
              <input type="number" className="ft-input form-control" value={duration} onChange={e => setDuration(e.target.value)} required min="1" placeholder="30" />
            </div>
            <div className="col-md-4">
              <label style={{ fontSize:'0.78rem', fontWeight:600, color:subText, textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:6, display:'block' }}>Notes</label>
              <input type="text" className="ft-input form-control" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Focused on legs" />
            </div>
          </div>
          <button type="submit" className="btn btn-gradient-primary mt-3" style={{ padding:'0.6rem 2rem' }}>
            ➕ Add Workout
          </button>
        </form>
      </div>

      {/* Search */}
      <div className="d-flex gap-2 mb-3 flex-wrap align-items-center">
        <input type="text" className="ft-input form-control flex-grow-1" style={{ maxWidth:320 }} placeholder="🔍 Search workouts..." value={search} onChange={e => setSearch(e.target.value)} />
        {filterType && (
          <button onClick={() => setFilterType('')} style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444', border:'none', borderRadius:10, padding:'0.5rem 1rem', fontWeight:600, fontSize:'0.82rem', cursor:'pointer' }}>
            ✕ {filterType}
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:20, padding:'1.5rem', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
        <h6 style={{ fontWeight:700, marginBottom:'1rem', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
          📋 History <span style={{ color:subText, fontWeight:400, fontSize:'0.85rem' }}>({filtered.length} entries)</span>
        </h6>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'3rem 0', color:subText }}>
            <div style={{ fontSize:'3rem', marginBottom:12 }}>🏃</div>
            <p style={{ fontWeight:500 }}>No workouts yet. Start your journey!</p>
          </div>
        ) : (
          filtered.map(w => {
            const m = TYPE_META[w.type];
            return (
              <div key={w.id} className="list-item-hover d-flex align-items-center gap-3 p-3">
                <div style={{ width:44, height:44, borderRadius:12, background:m.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>
                  {m.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, color: darkMode ? '#f1f5f9' : '#0f172a', fontSize:'0.9rem' }}>{w.type}</div>
                  <div style={{ fontSize:'0.78rem', color:subText, marginTop:2 }}>
                    📅 {w.date} · ⏱️ {w.duration} min {w.notes ? `· ${w.notes}` : ''}
                  </div>
                </div>
                <span style={{ fontSize:'0.75rem', fontWeight:700, color:m.color, background:m.bg, padding:'4px 12px', borderRadius:50, flexShrink:0 }}>{w.type}</span>
                <button
                  onClick={() => deleteWorkout(w.id)}
                  style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444', border:'none', borderRadius:10, width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, fontSize:'0.85rem' }}
                >
                  🗑️
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
