import { useState } from 'react'

const API = 'https://exoplanet-classifier-api.onrender.com'

const Card = ({ children, style }) => (
  <div style={{ background: '#0d1525', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '1.5rem', ...style }}>{children}</div>
)

const params = [
  { name: 'n_estimators', label: 'Number of Trees', min: 10, max: 500, step: 10, default: 100, tip: 'More trees = more accurate but slower' },
  { name: 'max_depth', label: 'Max Tree Depth', min: 1, max: 30, step: 1, default: 10, tip: 'Deeper trees learn more complex patterns' },
  { name: 'min_samples_split', label: 'Min Samples to Split', min: 2, max: 20, step: 1, default: 2, tip: 'Higher = more generalized model' },
  { name: 'learning_rate', label: 'Learning Rate (XGBoost)', min: 0.01, max: 0.5, step: 0.01, default: 0.1, tip: 'Lower = more careful learning' },
]

export default function HyperparamLab() {
  const [values, setValues] = useState(Object.fromEntries(params.map(p => [p.name, p.default])))
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleRetrain = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`${API}/retrain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      setResult(await res.json())
    } catch {
      setResult({ error: 'Could not reach backend' })
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontFamily: 'Space Mono', fontSize: '1.5rem', color: '#22d3ee', marginBottom: '0.25rem' }}>Hyperparam Lab</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Tune model parameters and retrain live — see how metrics change</p>
      </div>

      <Card>
        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {params.map(({ name, label, min, max, step, tip }) => (
            <div key={name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{label}</label>
                <span style={{ fontFamily: 'Space Mono', fontSize: '0.875rem', color: '#22d3ee', minWidth: '50px', textAlign: 'right' }}>{values[name]}</span>
              </div>
              <input
                type="range"
                min={min} max={max} step={step}
                value={values[name]}
                onChange={e => setValues({ ...values, [name]: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: '#22d3ee' }}
              />
              <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '4px' }}>{tip}</div>
            </div>
          ))}
        </div>

        <button
          onClick={handleRetrain}
          disabled={loading}
          style={{ background: loading ? '#1e3a5f' : '#0e7490', color: '#22d3ee', border: '1px solid #22d3ee', borderRadius: '8px', padding: '12px 28px', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em' }}
        >
          {loading ? '⟳ Retraining...' : '⟶ Retrain Model'}
        </button>
      </Card>

      {result && (
        <Card>
          <h2 style={{ fontSize: '0.875rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            {result.error ? 'Error' : 'New Model Results'}
          </h2>
          {result.error ? (
            <p style={{ color: '#f87171', fontSize: '0.875rem' }}>{result.error}</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
              {['accuracy', 'precision', 'recall', 'f1'].map(k => (
                <div key={k} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Space Mono', fontSize: '1.5rem', fontWeight: 700, color: '#4ade80' }}>
                    {result[k] ? `${(result[k] * 100).toFixed(1)}%` : '—'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
