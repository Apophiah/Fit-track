import { useState, type FormEvent } from 'react';
import { useApp } from '../context/AppContext';
import type { Meal } from '../types';

type MT = Meal['type'];
const MEAL_TYPES: MT[] = ['Breakfast','Lunch','Dinner','Snack'];
const MEAL_META: Record<MT, { icon:string; color:string; bg:string }> = {
  Breakfast: { icon:'🌅', color:'#f59e0b', bg:'rgba(245,158,11,0.1)' },
  Lunch:     { icon:'☀️', color:'#10b981', bg:'rgba(16,185,129,0.1)' },
  Dinner:    { icon:'🌙', color:'#6366f1', bg:'rgba(99,102,241,0.1)' },
  Snack:     { icon:'🍎', color:'#ef4444', bg:'rgba(239,68,68,0.1)'  },
};

export default function Nutrition() {
  const { meals, addMeal, deleteMeal, darkMode } = useApp();
  const [mealType, setMealType] = useState<MT | ''>('');
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const cardBorder = darkMode ? '#334155' : '#e2e8f0';
  const subText = darkMode ? '#94a3b8' : '#64748b';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!mealType) return;
    addMeal({ type:mealType, food, calories:parseInt(calories), protein:protein?parseInt(protein):undefined, carbs:carbs?parseInt(carbs):undefined, fat:fat?parseInt(fat):undefined, date, notes });
    setMealType(''); setFood(''); setCalories(''); setProtein(''); setCarbs(''); setFat(''); setDate(''); setNotes('');
  };

  const filtered = filterDate ? meals.filter(m => m.date === filterDate) : meals;
  const totalCal = filtered.reduce((s,m) => s + m.calories, 0);
  const totalP = filtered.reduce((s,m) => s + (m.protein||0), 0);
  const totalC = filtered.reduce((s,m) => s + (m.carbs||0), 0);
  const totalF = filtered.reduce((s,m) => s + (m.fat||0), 0);
  const DAILY_CAL = 2000;
  const calPct = Math.min(Math.round((totalCal / DAILY_CAL) * 100), 100);

  const labelStyle = { fontSize:'0.78rem', fontWeight:600 as const, color:subText, textTransform:'uppercase' as const, letterSpacing:'0.04em', marginBottom:6, display:'block' as const };

  return (
    <div>
      <div style={{ marginBottom:'2rem' }}>
        <h2 className="page-title">🥗 Nutrition Tracker</h2>
        <p style={{ color:subText, marginTop:4 }}>Track your meals and monitor daily intake.</p>
      </div>

      {/* Macro summary */}
      <div className="row g-3 mb-4">
        {[
          { label:'Calories', val:totalCal, unit:'kcal', color:'#ef4444', bg:'rgba(239,68,68,0.1)', pct:calPct },
          { label:'Protein',  val:totalP,   unit:'g',    color:'#6366f1', bg:'rgba(99,102,241,0.1)', pct:null },
          { label:'Carbs',    val:totalC,   unit:'g',    color:'#f59e0b', bg:'rgba(245,158,11,0.1)', pct:null },
          { label:'Fat',      val:totalF,   unit:'g',    color:'#10b981', bg:'rgba(16,185,129,0.1)', pct:null },
        ].map((s,i) => (
          <div key={i} className="col-6 col-md-3">
            <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:18, padding:'1.25rem', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize:'0.78rem', color:subText, fontWeight:600, textTransform:'uppercase', marginBottom:6 }}>{s.label}</div>
              <div style={{ fontSize:'1.5rem', fontWeight:900, color:s.color, lineHeight:1 }}>{s.val}<span style={{ fontSize:'0.75rem', fontWeight:500, marginLeft:3 }}>{s.unit}</span></div>
              {s.pct !== null && (
                <div style={{ marginTop:8 }}>
                  <div style={{ height:4, borderRadius:100, background:`${s.bg}`, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${s.pct}%`, background:s.color, borderRadius:100, transition:'width 0.6s' }} />
                  </div>
                  <span style={{ fontSize:'0.72rem', color:subText }}>{s.pct}% of {DAILY_CAL} kcal daily goal</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Meal form */}
      <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:20, padding:'1.75rem', marginBottom:'1.5rem', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
        <h6 style={{ fontWeight:700, marginBottom:'1.25rem', color: darkMode ? '#f1f5f9' : '#0f172a' }}>➕ Log a Meal</h6>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-3"><label style={labelStyle}>Meal Type</label>
              <select className="ft-input form-select" value={mealType} onChange={e => setMealType(e.target.value as MT)} required>
                <option value="">Select...</option>
                {MEAL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-md-3"><label style={labelStyle}>Food Name</label>
              <input type="text" className="ft-input form-control" placeholder="e.g. Oatmeal" value={food} onChange={e => setFood(e.target.value)} required />
            </div>
            <div className="col-md-2"><label style={labelStyle}>Calories</label>
              <input type="number" className="ft-input form-control" placeholder="350" value={calories} onChange={e => setCalories(e.target.value)} required min="0" />
            </div>
            <div className="col-md-2"><label style={labelStyle}>Date</label>
              <input type="date" className="ft-input form-control" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="col-md-2"><label style={labelStyle}>Protein (g)</label>
              <input type="number" className="ft-input form-control" placeholder="0" value={protein} onChange={e => setProtein(e.target.value)} min="0" />
            </div>
            <div className="col-md-2"><label style={labelStyle}>Carbs (g)</label>
              <input type="number" className="ft-input form-control" placeholder="0" value={carbs} onChange={e => setCarbs(e.target.value)} min="0" />
            </div>
            <div className="col-md-2"><label style={labelStyle}>Fat (g)</label>
              <input type="number" className="ft-input form-control" placeholder="0" value={fat} onChange={e => setFat(e.target.value)} min="0" />
            </div>
            <div className="col-md-6"><label style={labelStyle}>Notes (optional)</label>
              <input type="text" className="ft-input form-control" placeholder="Any notes..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn btn-gradient-primary mt-3" style={{ padding:'0.6rem 2rem' }}>➕ Add Meal</button>
        </form>
      </div>

      {/* Filter */}
      <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
        <span style={{ fontSize:'0.82rem', fontWeight:600, color:subText }}>📅 Filter:</span>
        <input type="date" className="ft-input form-control" style={{ maxWidth:180 }} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        {filterDate && <button onClick={() => setFilterDate('')} style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444', border:'none', borderRadius:10, padding:'0.45rem 1rem', fontWeight:600, fontSize:'0.82rem', cursor:'pointer' }}>✕ Clear</button>}
      </div>

      {/* List */}
      <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:20, padding:'1.5rem', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
        <h6 style={{ fontWeight:700, marginBottom:'1rem', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
          🍱 Meal History <span style={{ color:subText, fontWeight:400, fontSize:'0.85rem' }}>({filtered.length} entries)</span>
        </h6>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'3rem 0', color:subText }}>
            <div style={{ fontSize:'3rem', marginBottom:12 }}>🥗</div>
            <p style={{ fontWeight:500 }}>No meals logged yet.</p>
          </div>
        ) : (
          [...filtered].reverse().map(m => {
            const meta = MEAL_META[m.type];
            return (
              <div key={m.id} className="list-item-hover d-flex align-items-start gap-3 p-3">
                <div style={{ width:44, height:44, borderRadius:12, background:meta.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>
                  {meta.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span style={{ fontWeight:700, color: darkMode ? '#f1f5f9' : '#0f172a', fontSize:'0.9rem' }}>{m.food}</span>
                    <span style={{ fontSize:'0.72rem', fontWeight:700, color:meta.color, background:meta.bg, padding:'2px 10px', borderRadius:50 }}>{m.type}</span>
                  </div>
                  <div style={{ fontSize:'0.78rem', color:subText, marginTop:3 }}>
                    🔥 {m.calories} kcal · 📅 {m.date}
                    {m.protein ? ` · P:${m.protein}g` : ''}
                    {m.carbs ? ` · C:${m.carbs}g` : ''}
                    {m.fat ? ` · F:${m.fat}g` : ''}
                    {m.notes ? ` · ${m.notes}` : ''}
                  </div>
                </div>
                <button onClick={() => deleteMeal(m.id)} style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444', border:'none', borderRadius:10, width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, fontSize:'0.85rem' }}>🗑️</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
