import { useState, type FormEvent } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useApp } from '../context/AppContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function Progress() {
  const { weeklyStats, saveWeeklyStats, darkMode } = useApp();
  const [chartType, setChartType] = useState<'line'|'bar'>('line');
  const [day, setDay] = useState('');
  const [steps, setSteps] = useState('');
  const [calories, setCalories] = useState('');
  const [distance, setDistance] = useState('');
  const [heartRate, setHeartRate] = useState('');

  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const cardBorder = darkMode ? '#334155' : '#e2e8f0';
  const subText = darkMode ? '#94a3b8' : '#64748b';
  const gridColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const labelColor = darkMode ? '#94a3b8' : '#64748b';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const idx = DAYS.indexOf(day);
    if (idx < 0) return;
    const s = { ...weeklyStats };
    s.steps[idx] = parseInt(steps);
    s.calories[idx] = parseInt(calories);
    s.distance[idx] = parseFloat(distance);
    s.heartRate[idx] = parseInt(heartRate);
    saveWeeklyStats(s);
    setDay(''); setSteps(''); setCalories(''); setDistance(''); setHeartRate('');
  };

  const opts = (color: string) => ({
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: darkMode ? '#0f172a' : '#fff', titleColor: darkMode ? '#f1f5f9' : '#0f172a', bodyColor: labelColor, borderColor: cardBorder, borderWidth: 1, padding: 10, cornerRadius: 10 } },
    scales: {
      y: { beginAtZero: false, grid: { color: gridColor }, ticks: { color: labelColor, font: { size: 11 } }, border: { display: false } },
      x: { grid: { display: false }, ticks: { color: labelColor, font: { size: 11 } }, border: { display: false } },
    },
  });

  const mkData = (data: number[], color: string, bg: string) => ({
    labels: DAYS,
    datasets: [{ data, borderColor: color, backgroundColor: bg, fill: true, tension: 0.4, pointBackgroundColor: color, pointRadius: 4, pointHoverRadius: 6, borderWidth: 2.5 }],
  });

  const charts = [
    { title:'👟 Steps',       data: mkData(weeklyStats.steps,    '#6366f1', 'rgba(99,102,241,0.08)'),  color:'#6366f1' },
    { title:'🔥 Calories',    data: mkData(weeklyStats.calories, '#10b981', 'rgba(16,185,129,0.08)'),  color:'#10b981' },
    { title:'🚀 Distance km', data: mkData(weeklyStats.distance, '#06b6d4', 'rgba(6,182,212,0.08)'),   color:'#06b6d4' },
    { title:'❤️ Heart Rate',  data: mkData(weeklyStats.heartRate,'#ef4444', 'rgba(239,68,68,0.08)'),   color:'#ef4444' },
  ];

  const ChartCmp = chartType === 'line' ? Line : Bar;

  const labelStyle = { fontSize:'0.78rem', fontWeight:600 as const, color:subText, textTransform:'uppercase' as const, letterSpacing:'0.04em', marginBottom:6, display:'block' as const };

  return (
    <div>
      <div style={{ marginBottom:'2rem' }}>
        <h2 className="page-title">📈 Weekly Progress</h2>
        <p style={{ color:subText, marginTop:4 }}>Track your fitness metrics across the week.</p>
      </div>

      <div className="d-flex justify-content-end mb-4 gap-2">
        {(['line','bar'] as const).map(t => (
          <button key={t} onClick={() => setChartType(t)}
            style={{
              borderRadius:10, padding:'0.45rem 1.2rem', fontWeight:600, fontSize:'0.85rem', cursor:'pointer', border:'none',
              background: chartType===t ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : (darkMode ? '#1e293b' : '#f1f5f9'),
              color: chartType===t ? '#fff' : subText,
              boxShadow: chartType===t ? '0 4px 15px rgba(99,102,241,0.35)' : 'none',
            }}
          >{t === 'line' ? '📈 Line' : '📊 Bar'}</button>
        ))}
      </div>

      <div className="row g-4 mb-4">
        {charts.map((c,i) => (
          <div key={i} className="col-md-6">
            <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:20, padding:'1.5rem', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 style={{ fontWeight:700, margin:0, color: darkMode ? '#f1f5f9' : '#0f172a', fontSize:'0.9rem' }}>{c.title}</h6>
                <span style={{ fontSize:'1.2rem', fontWeight:900, color:c.color }}>
                  {c.title.includes('Steps') ? weeklyStats.steps.reduce((a,b)=>a+b,0).toLocaleString()
                  : c.title.includes('Calories') ? weeklyStats.calories.reduce((a,b)=>a+b,0)
                  : c.title.includes('Distance') ? weeklyStats.distance.reduce((a,b)=>a+b,0).toFixed(1)
                  : (weeklyStats.heartRate.reduce((a,b)=>a+b,0)/7).toFixed(0)}
                </span>
              </div>
              <ChartCmp data={c.data} options={opts(c.color) as any} />
            </div>
          </div>
        ))}
      </div>

      {/* Update form */}
      <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:20, padding:'1.75rem', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
        <h6 style={{ fontWeight:700, marginBottom:'1.25rem', color: darkMode ? '#f1f5f9' : '#0f172a' }}>✏️ Update Data</h6>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-2"><label style={labelStyle}>Day</label>
              <select className="ft-input form-select" value={day} onChange={e => setDay(e.target.value)} required>
                <option value="">Day...</option>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            {[
              { label:'Steps', val:steps, set:setSteps, step:'1', ph:'8000' },
              { label:'Calories', val:calories, set:setCalories, step:'1', ph:'500' },
              { label:'Distance (km)', val:distance, set:setDistance, step:'0.1', ph:'5.0' },
              { label:'Heart Rate', val:heartRate, set:setHeartRate, step:'1', ph:'75' },
            ].map(f => (
              <div key={f.label} className="col-md-2-half" style={{ flex:'0 0 calc(25% - 12px)', maxWidth:'calc(25% - 12px)', minWidth:120 }}>
                <label style={labelStyle}>{f.label}</label>
                <input type="number" className="ft-input form-control" step={f.step} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} required />
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-gradient-success mt-3" style={{ padding:'0.6rem 2rem' }}>💾 Save</button>
        </form>
      </div>
    </div>
  );
}
