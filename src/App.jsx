import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/home'
import Classify from './pages/classify'
import Insights from './pages/insights'
import HyperparamLab from './pages/hyperparamlab'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div className="planet-small" />
      <nav style={{
        background: 'rgba(8, 15, 35, 0.85)',
        borderBottom: '1px solid #1e3a5f',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '1rem' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #1a6fa8, #0a2a4a)',
            boxShadow: '0 0 12px #22d3ee55',
            flexShrink: 0
          }} />
          <div>
            <div style={{
              fontFamily: 'Space Grotesk',
              fontWeight: 700,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #ffffff, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.03em',
              lineHeight: 1.1
            }}>
              Kepler Vision
            </div>
            <div style={{ fontSize: '0.6rem', color: '#475569', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Exoplanet Finder
            </div>
          </div>
        </div>

        {[
          { to: '/', label: 'Dashboard' },
          { to: '/classify', label: 'Classify' },
          { to: '/insights', label: 'Model Insights' },
          { to: '/lab', label: 'Hyperparam Lab' },
        ].map(({ to, label }) => (
          <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
            fontSize: '0.875rem',
            color: isActive ? '#22d3ee' : '#64748b',
            borderBottom: isActive ? '2px solid #22d3ee' : '2px solid transparent',
            paddingBottom: '4px',
            letterSpacing: '0.03em',
            transition: 'color 0.2s'
          })}>
            {label}
          </NavLink>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#4ade80',
            boxShadow: '0 0 8px #4ade80'
          }} />
          <span style={{ fontSize: '0.75rem', color: '#4ade80', letterSpacing: '0.05em' }}>Model Online</span>
        </div>
      </nav>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classify" element={<Classify />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/lab" element={<HyperparamLab />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App