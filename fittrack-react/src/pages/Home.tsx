import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const features = [
  { icon: '⚡', title: 'Smart Dashboard',    desc: 'All your key metrics — steps, calories, heart rate — at a glance.',  color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
  { icon: '🏋️', title: 'Workout Tracker',   desc: 'Log sessions, filter by type, track your total training time.',        color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { icon: '🥗', title: 'Nutrition Logger',   desc: 'Track meals, macros, and daily calorie intake effortlessly.',           color: '#ef4444', bg: 'rgba(239,68,68,0.1)'  },
  { icon: '📈', title: 'Progress Charts',    desc: 'Interactive weekly charts for steps, distance, heart rate & more.',    color: '#06b6d4', bg: 'rgba(6,182,212,0.1)'   },
  { icon: '🎯', title: 'Goal Setting',       desc: 'Set fitness targets and watch your progress bars fill up.',            color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  { icon: '💬', title: 'Community',          desc: 'Post milestones, like and comment on your fitness peers.',             color: '#a855f7', bg: 'rgba(168,85,247,0.1)'  },
];

const quotes = [
  { text: '"Take care of your body. It\'s the only place you have to live."', author: '— Jim Rohn' },
  { text: '"The pain you feel today will be the strength you feel tomorrow."', author: '— Unknown' },
  { text: '"Fitness is not about being better than someone else. It\'s about being better than you used to be."', author: '— Unknown' },
  { text: '"Your body can stand almost anything. It\'s your mind you have to convince."', author: '— Unknown' },
];

export default function Home() {
  const { currentUser, darkMode } = useApp();
  const navigate = useNavigate();
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const cardBorder = darkMode ? '#334155' : '#e2e8f0';

  return (
    <div>
      {/* ── Hero ── */}
      <div
        className="fade-up"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 55%, #10b981 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 8s ease infinite',
          borderRadius: 28,
          padding: 'clamp(3rem,8vw,5rem) 2rem',
          textAlign: 'center',
          marginBottom: '3rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div style={{ position:'absolute', bottom:-100, left:-60, width:250, height:250, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />

        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{
            width:80, height:80,
            background:'rgba(255,255,255,0.2)',
            borderRadius:22,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'2.5rem', margin:'0 auto 1.5rem',
            boxShadow:'0 8px 30px rgba(0,0,0,0.15)',
            backdropFilter:'blur(10px)',
          }}>
            💪
          </div>
          <h1 style={{ color:'#fff', fontWeight:900, fontSize:'clamp(2rem,5vw,3.2rem)', marginBottom:'1rem', textShadow:'0 2px 20px rgba(0,0,0,0.15)' }}>
            Welcome to FitTrack
          </h1>
          <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'1.15rem', maxWidth:520, margin:'0 auto 2rem', lineHeight:1.6 }}>
            Your all-in-one personal fitness tracker, nutrition assistant, and wellness companion.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button
              onClick={() => navigate(currentUser ? '/dashboard' : '/login')}
              style={{
                background:'#fff', color:'#6366f1', border:'none',
                borderRadius:14, padding:'0.85rem 2.2rem',
                fontWeight:800, fontSize:'1rem',
                boxShadow:'0 8px 30px rgba(0,0,0,0.15)',
                cursor:'pointer', transition:'transform 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              🚀 Get Started
            </button>
            {!currentUser && (
              <button
                onClick={() => navigate('/signup')}
                style={{
                  background:'rgba(255,255,255,0.15)', color:'#fff',
                  border:'2px solid rgba(255,255,255,0.4)',
                  borderRadius:14, padding:'0.85rem 2.2rem',
                  fontWeight:700, fontSize:'1rem',
                  cursor:'pointer', backdropFilter:'blur(8px)',
                  transition:'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.15)'; }}
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats ticker ── */}
      <div className="row g-3 mb-5 fade-up delay-1">
        {[
          { val:'10K+', label:'Active Users',    icon:'👥', color:'#6366f1' },
          { val:'500K+', label:'Workouts Logged', icon:'🏋️', color:'#10b981' },
          { val:'1M+',  label:'Meals Tracked',   icon:'🥗', color:'#ef4444' },
          { val:'99%',  label:'Satisfaction',    icon:'⭐', color:'#f59e0b' },
        ].map((s,i) => (
          <div key={i} className="col-6 col-md-3">
            <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:18, padding:'1.25rem', textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize:'1.8rem', marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontSize:'1.6rem', fontWeight:900, color:s.color }}>{s.val}</div>
              <div style={{ fontSize:'0.8rem', color: darkMode ? '#94a3b8' : '#64748b', fontWeight:500 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Features ── */}
      <div className="mb-5">
        <div className="text-center mb-4 fade-up">
          <h2 style={{ fontWeight:900, fontSize:'clamp(1.5rem,4vw,2rem)', color: darkMode ? '#f1f5f9' : '#0f172a', marginBottom:8 }}>
            Everything You Need
          </h2>
          <p style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize:'1rem', maxWidth:460, margin:'0 auto' }}>
            Powerful tools to help you reach your fitness goals faster.
          </p>
        </div>
        <div className="row g-3">
          {features.map((f, i) => (
            <div key={i} className={`col-md-4 col-sm-6 fade-up delay-${(i%4)+1}`}>
              <div
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: 20,
                  padding: '1.5rem',
                  height: '100%',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                  cursor: 'default',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(-5px)'; (e.currentTarget as HTMLDivElement).style.boxShadow=`0 16px 40px rgba(0,0,0,0.1)`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow=''; }}
              >
                <div style={{ width:52, height:52, borderRadius:14, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', marginBottom:'1rem' }}>
                  {f.icon}
                </div>
                <h6 style={{ fontWeight:700, marginBottom:6, color: darkMode ? '#f1f5f9' : '#0f172a', fontSize:'0.95rem' }}>{f.title}</h6>
                <p style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize:'0.85rem', margin:0, lineHeight:1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quotes ── */}
      <div style={{ background: darkMode ? '#1e293b' : 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(6,182,212,0.06))', borderRadius:24, padding:'2.5rem 2rem', border:`1px solid ${cardBorder}` }} className="fade-up">
        <h5 style={{ textAlign:'center', fontWeight:800, marginBottom:'1.5rem', color: darkMode ? '#f1f5f9' : '#0f172a' }}>💬 Daily Motivation</h5>
        <div id="quoteCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {quotes.map((q, i) => (
              <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                <div style={{ textAlign:'center', padding:'0 2rem' }}>
                  <p style={{ fontSize:'clamp(1rem,2.5vw,1.2rem)', fontStyle:'italic', fontWeight:600, color: darkMode ? '#f1f5f9' : '#0f172a', marginBottom:12, lineHeight:1.6 }}>
                    {q.text}
                  </p>
                  <span style={{ color: darkMode ? '#94a3b8' : '#64748b', fontWeight:500, fontSize:'0.9rem' }}>{q.author}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#quoteCarousel" data-bs-slide="prev">
            <span style={{ background:'rgba(99,102,241,0.2)', borderRadius:'50%', width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', color: darkMode ? '#fff':'#6366f1', fontSize:'1rem' }}>‹</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#quoteCarousel" data-bs-slide="next">
            <span style={{ background:'rgba(99,102,241,0.2)', borderRadius:'50%', width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', color: darkMode ? '#fff':'#6366f1', fontSize:'1rem' }}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
