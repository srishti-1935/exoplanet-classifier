import { useState } from 'react'

const API = 'https://exoplanet-classifier-api.onrender.com'

const Card = ({ children, style }) => (
  <div style={{
    background: 'rgba(8, 15, 35, 0.75)',
    border: '1px solid #1e3a5f',
    borderRadius: '16px',
    padding: '1.5rem',
    backdropFilter: 'blur(12px)',
    ...style
  }}>{children}</div>
)

const StatBadge = ({ label, value, color, glow }) => (
  <div style={{
    background: 'rgba(8, 15, 35, 0.75)',
    border: `1px solid ${color}44`,
    borderRadius: '16px',
    padding: '1.5rem',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`
    }} />
    <div style={{ fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</div>
    <div style={{ fontSize: '1.9rem', fontWeight: 700, color, fontFamily: 'Space Grotesk', textShadow: `0 0 20px ${color}66` }}>{value}</div>
  </div>
)

export default function Home() {
  const [form, setForm] = useState({ koi_period: '', koi_depth: '', koi_duration: '', koi_impact: '', koi_insol: '', koi_prad: '', koi_teq: '', koi_steff: '', koi_srad: '', koi_model_snr: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(Object.entries(form).map(([k, v]) => [k, parseFloat(v)])))
      })
      setResult(await res.json())
    } catch {
      setResult({ error: 'Could not reach backend. Is it running?' })
    }
    setLoading(false)
  }

  const labelColor = l => l === 'CONFIRMED' ? '#4ade80' : l === 'FALSE POSITIVE' ? '#f87171' : '#fbbf24'

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          fontSize: '0.7rem',
          color: '#22d3ee',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ display: 'inline-block', width: '20px', height: '1px', background: '#22d3ee' }} />
          NASA Space Apps 2026
          <span style={{ display: 'inline-block', width: '20px', height: '1px', background: '#22d3ee' }} />
        </div>

        <h1 style={{
          fontSize: '3rem',
          fontWeight: 700,
          fontFamily: 'Space Grotesk',
          background: 'linear-gradient(135deg, #ffffff 0%, #22d3ee 50%, #818cf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem',
          lineHeight: 1.1
        }}>
          Mission Control
        </h1>

        <p style={{ color: '#64748b', fontSize: '0.95rem', letterSpacing: '0.02em' }}>
          Kepler exoplanet classifier — real-time transit signal analysis
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatBadge label="Model Accuracy" value="94.2%" color="#22d3ee" />
        <StatBadge label="Confirmed Planets" value="2,662" color="#4ade80" />
        <StatBadge label="False Positives" value="4,351" color="#f87171" />
        <StatBadge label="Candidates" value="3,274" color="#fbbf24" />
      </div>

      <Card>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#e2e8f0',
            marginBottom: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ color: '#22d3ee' }}>✦</span> Quick Classify
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#475569' }}>Enter transit parameters for a single star</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {[
            { name: 'koi_period', label: 'Orbital Period (days)' },
            { name: 'koi_depth', label: 'Transit Depth (ppm)' },
            { name: 'koi_duration', label: 'Transit Duration (hrs)' },
            { name: 'koi_impact', label: 'Impact Parameter' },
            { name: 'koi_insol', label: 'Insolation Flux' },
{ name: 'koi_prad', label: 'Planet Radius' },
{ name: 'koi_teq', label: 'Equilibrium Temp' },
{ name: 'koi_steff', label: 'Stellar Temp' },
{ name: 'koi_srad', label: 'Stellar Radius' },
{ name: 'koi_model_snr', label: 'Model SNR' },
          ].map(({ name, label }) => (
            <div key={name}>
              <label style={{ fontSize: '0.72rem', color: '#475569', display: 'block', marginBottom: '5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder="0.00"
                style={{
                  width: '100%',
                  background: 'rgba(2, 8, 23, 0.8)',
                  border: '1px solid #1e3a5f',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  padding: '10px 14px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#22d3ee'}
                onBlur={e => e.target.style.borderColor = '#1e3a5f'}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: loading ? 'rgba(14, 116, 144, 0.3)' : 'linear-gradient(135deg, #0e7490, #0369a1)',
            color: '#e2e8f0',
            border: '1px solid #22d3ee55',
            borderRadius: '10px',
            padding: '11px 32px',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            boxShadow: loading ? 'none' : '0 0 20px #22d3ee22',
            transition: 'all 0.2s'
          }}
        >
          {loading ? '⟳ Analysing...' : '✦ Classify Star'}
        </button>

        {result && (
          <div style={{
            marginTop: '1.25rem',
            padding: '1.25rem',
            background: 'rgba(2, 8, 23, 0.8)',
            borderRadius: '12px',
            border: `1px solid ${result.error ? '#f8717144' : labelColor(result.label) + '44'}`,
            boxShadow: result.error ? 'none' : `0 0 30px ${labelColor(result?.label)}11`
          }}>
            {result.error ? (
              <p style={{ color: '#f87171', fontSize: '0.875rem' }}>{result.error}</p>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontSize: '1.2rem', fontWeight: 700,
                    color: labelColor(result.label),
                    textShadow: `0 0 20px ${labelColor(result.label)}88`
                  }}>{result.label}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {(result.confidence * 100).toFixed(1)}% confidence
                  </span>
                </div>
                {result.top_features && (
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                    Strongest signal: <span style={{ color: '#94a3b8' }}>{result.top_features[0]?.feature}</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
