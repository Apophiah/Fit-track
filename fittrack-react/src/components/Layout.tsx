import type { ReactNode } from 'react';
import Navbar from './Navbar';
import { useApp } from '../context/AppContext';

export default function Layout({ children }: { children: ReactNode }) {
  const { darkMode } = useApp();

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f1f5f9', transition: 'background 0.3s' }}>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.25rem' }}>
        {children}
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        marginTop: '2rem',
        borderTop: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`,
        color: darkMode ? '#475569' : '#94a3b8',
        fontSize: '0.82rem',
        fontWeight: 500,
      }}>
        © 2025 FitTrack — Built with ❤️ by Appo
      </footer>
    </div>
  );
}
