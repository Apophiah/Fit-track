import { useState, type FormEvent } from 'react';
import { useApp } from '../context/AppContext';

const AVATARCOLORS = ['#6366f1','#10b981','#ef4444','#f59e0b','#06b6d4','#a855f7'];
const getColor = (name: string) => AVATARCOLORS[name.charCodeAt(0) % AVATARCOLORS.length];

export default function Community() {
  const { posts, addPost, toggleLike, addComment, currentUser, darkMode } = useApp();
  const [username, setUsername] = useState(currentUser || '');
  const [content, setContent] = useState('');
  const [openCommentId, setOpenCommentId] = useState<string|null>(null);
  const [commentText, setCommentText] = useState('');
  const [search, setSearch] = useState('');

  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const cardBorder = darkMode ? '#334155' : '#e2e8f0';
  const subText = darkMode ? '#94a3b8' : '#64748b';

  const handlePost = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !content.trim()) return;
    addPost(username.trim(), content.trim());
    setContent('');
  };

  const filtered = posts.filter(p =>
    !search || p.username.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom:'2rem' }}>
        <h2 className="page-title">💬 Community</h2>
        <p style={{ color:subText, marginTop:4 }}>{posts.length} posts · Share your journey!</p>
      </div>

      {/* Post form */}
      <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:20, padding:'1.75rem', marginBottom:'1.5rem', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
        <h6 style={{ fontWeight:700, marginBottom:'1.25rem', color: darkMode ? '#f1f5f9' : '#0f172a' }}>✍️ Share Something</h6>
        <form onSubmit={handlePost}>
          <input type="text" className="ft-input form-control mb-3" placeholder="Your name" value={username} onChange={e => setUsername(e.target.value)} required />
          <textarea rows={3} className="ft-input form-control mb-3" placeholder="Share a milestone, tip, or question... 💪" value={content} onChange={e => setContent(e.target.value)} required style={{ resize:'none' }} />
          <button type="submit" className="btn btn-gradient-primary" style={{ padding:'0.6rem 2rem' }}>🚀 Post</button>
        </form>
      </div>

      {/* Search */}
      <input type="text" className="ft-input form-control mb-4" placeholder="🔍 Search posts..." value={search} onChange={e => setSearch(e.target.value)} />

      {/* Feed */}
      {filtered.length === 0 ? (
        <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:20, padding:'4rem', textAlign:'center', color:subText }}>
          <div style={{ fontSize:'3rem', marginBottom:12 }}>💬</div>
          <p style={{ fontWeight:600 }}>No posts yet. Be the first to share!</p>
        </div>
      ) : (
        filtered.map(post => (
          <div key={post.id} style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:20, padding:'1.5rem', marginBottom:'1rem', boxShadow:'0 4px 20px rgba(0,0,0,0.04)', transition:'transform 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.transform='translateY(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform='translateY(0)')}
          >
            {/* Header */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{ width:40, height:40, borderRadius:'50%', background:`linear-gradient(135deg, ${getColor(post.username)}, ${getColor(post.username)}aa)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'1rem', boxShadow:`0 3px 12px ${getColor(post.username)}66` }}>
                {post.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight:700, color: darkMode ? '#f1f5f9' : '#0f172a', fontSize:'0.9rem' }}>@{post.username}</div>
                <div style={{ fontSize:'0.72rem', color:subText }}>{new Date(post.timestamp).toLocaleString()}</div>
              </div>
            </div>

            <p style={{ color: darkMode ? '#cbd5e1' : '#334155', lineHeight:1.7, marginBottom:'1rem', fontSize:'0.92rem' }}>{post.content}</p>

            {/* Actions */}
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => toggleLike(post.id)}
                style={{
                  background: post.liked ? 'rgba(239,68,68,0.1)' : (darkMode ? 'rgba(255,255,255,0.06)' : '#f8fafc'),
                  color: post.liked ? '#ef4444' : subText,
                  border: `1px solid ${post.liked ? 'rgba(239,68,68,0.25)' : cardBorder}`,
                  borderRadius:10, padding:'0.4rem 1rem', fontWeight:600, cursor:'pointer', fontSize:'0.82rem',
                  transition:'all 0.2s',
                }}
              >
                {post.liked ? '❤️' : '🤍'} {post.likes}
              </button>
              <button
                onClick={() => setOpenCommentId(openCommentId === post.id ? null : post.id)}
                style={{
                  background: darkMode ? 'rgba(255,255,255,0.06)' : '#f8fafc',
                  color: openCommentId === post.id ? '#6366f1' : subText,
                  border: `1px solid ${openCommentId === post.id ? 'rgba(99,102,241,0.3)' : cardBorder}`,
                  borderRadius:10, padding:'0.4rem 1rem', fontWeight:600, cursor:'pointer', fontSize:'0.82rem',
                }}
              >
                💬 {post.comments.length}
              </button>
            </div>

            {/* Comments */}
            {post.comments.length > 0 && (
              <div style={{ marginTop:'1rem', paddingLeft:'0.75rem', borderLeft:'2px solid rgba(99,102,241,0.2)' }}>
                {post.comments.map(c => (
                  <div key={c.id} style={{ marginBottom:'0.6rem' }}>
                    <span style={{ fontWeight:700, fontSize:'0.8rem', color:'#6366f1' }}>@{c.username}</span>
                    <span style={{ fontSize:'0.72rem', color:subText, marginLeft:6 }}>{new Date(c.timestamp).toLocaleString()}</span>
                    <p style={{ fontSize:'0.85rem', color: darkMode ? '#cbd5e1' : '#334155', margin:'2px 0 0' }}>{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            {openCommentId === post.id && (
              <div className="d-flex gap-2 mt-3">
                <input
                  type="text"
                  className="ft-input form-control"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      if (!commentText.trim()) return;
                      addComment(post.id, currentUser || username || 'Anonymous', commentText.trim());
                      setCommentText('');
                      setOpenCommentId(null);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (!commentText.trim()) return;
                    addComment(post.id, currentUser || username || 'Anonymous', commentText.trim());
                    setCommentText('');
                    setOpenCommentId(null);
                  }}
                  className="btn btn-gradient-primary"
                  style={{ padding:'0.5rem 1.2rem', flexShrink:0 }}
                >
                  Send
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
