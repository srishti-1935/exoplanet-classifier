import { useState } from 'react'

const API = 'http://localhost:8000'

const Card = ({ children, style }) => (
  <div style={{ background: '#0d1525', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '1.5rem', ...style }}>{children}</div>
)

const fields = [
  { name: 'koi_period', label: 'Orbital Period', unit: 'days', tip: 'How long the planet takes to orbit its star' },
  { name: 'koi_depth', label: 'Transit Depth', unit: 'ppm', tip: 'How much starlight is blocked during transit' },
  { name: 'koi_duration', label: 'Transit Duration', unit: 'hrs', tip: 'How long the transit event lasts' },
  { name: 'koi_impact', label: 'Impact Parameter', unit: '0–1', tip: 'How centrally the planet crosses the star (0 = center)' },
  { name: 'koi_insol', label: 'Insolation Flux', unit: 'Earth flux', tip: 'Stellar radiation received relative to Earth' },
  { name: 'koi_prad', label: 'Planet Radius', unit: 'Earth radii', tip: 'Estimated size of the planet' },
  { name: 'koi_teq', label: 'Equilibrium Temp', unit: 'K', tip: 'Estimated surface temperature of the planet' },
  { name: 'koi_steff', label: 'Stellar Temp', unit: 'K', tip: 'Temperature of the host star' },
  { name: 'koi_slogg', label: 'Stellar Surface Gravity', unit: 'log g', tip: 'Surface gravity of the host star' },
  { name: 'koi_srad', label: 'Stellar Radius', unit: 'Solar radii', tip: 'Size of the host star' },
]

export default function Classify() {
  const [form, setForm] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [batchResults, setBatchResults] = useState(null)
  const [batchLoading, setBatchLoading] = useState(false)
  const [tooltip, setTooltip] = useState(null)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePredict = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      setResult(await res.json())
    } catch {
      setResult({ error: 'Backend not reachable' })
    }
    setLoading(false)
  }

  const handleBatch = async () => {
    if (!file) return
    setBatchLoading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch(`${API}/batch-predict`, { method: 'POST', body: fd })
      const data = await res.json()
      setBatchResults(data)
    } catch {
      setBatchResults({ error: 'Upload failed' })
    }
    setBatchLoading(false)
  }

  const labelColor = l => l === 'CONFIRMED' ? '#4ade80' : l === 'FALSE POSITIVE' ? '#f87171' : '#fbbf24'

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontFamily: 'Space Mono', fontSize: '1.5rem', color: '#22d3ee', marginBottom: '0.25rem' }}>Classify</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Enter transit features manually or upload a CSV for batch classification</p>
      </div>

      <Card>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '1rem' }}>Manual Entry</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
          {fields.map(({ name, label, unit, tip }) => (
            <div key={name}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: '#64748b' }}>{label}</label>
                <span
                  onMouseEnter={() => setTooltip(tip)}
                  onMouseLeave={() => setTooltip(null)}
                  style={{ fontSize: '0.7rem', color: '#0e7490', cursor: 'help', border: '1px solid #0e7490', borderRadius: '50%', width: '14px', height: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >?</span>
              </div>
              <input
                name={name}
                value={form[name] || ''}
                onChange={handleChange}
                placeholder={unit}
                style={{ width: '100%', background: '#070b14', border: '1px solid #1e3a5f', borderRadius: '8px', color: '#e2e8f0', padding: '8px 12px', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>
          ))}
        </div>

        {tooltip && (
          <div style={{ fontSize: '0.75rem', color: '#22d3ee', background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: '6px', padding: '8px 12px', marginBottom: '1rem' }}>
            {tooltip}
          </div>
        )}

        <button onClick={handlePredict} disabled={loading} style={{ background: '#0e7490', color: '#22d3ee', border: '1px solid #22d3ee', borderRadius: '8px', padding: '10px 24px', fontSize: '0.875rem', fontWeight: 600 }}>
          {loading ? 'Classifying...' : '⟶ Classify'}
        </button>

        {result && !result.error && (
          <div style={{ marginTop: '1.25rem', background: '#070b14', borderRadius: '8px', border: `1px solid ${labelColor(result.label)}`, padding: '1rem' }}>
            <div style={{ fontFamily: 'Space Mono', fontSize: '1.5rem', fontWeight: 700, color: labelColor(result.label), marginBottom: '0.5rem' }}>
              {result.label}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              Confidence: <strong style={{ color: '#e2e8f0' }}>{(result.confidence * 100).toFixed(1)}%</strong>
            </div>
            {result.top_features && (
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Top Features</div>
                {result.top_features.slice(0, 5).map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', width: '140px', flexShrink: 0 }}>{f.feature}</div>
                    <div style={{ flex: 1, height: '6px', background: '#1e3a5f', borderRadius: '3px' }}>
                      <div style={{ width: `${(f.importance * 100).toFixed(0)}%`, height: '100%', background: '#22d3ee', borderRadius: '3px' }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#22d3ee', width: '40px', textAlign: 'right' }}>{(f.importance * 100).toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {result?.error && <p style={{ color: '#f87171', marginTop: '1rem', fontSize: '0.875rem' }}>{result.error}</p>}
      </Card>

      <Card>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '1rem' }}>Batch Upload — CSV</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} style={{ fontSize: '0.875rem', color: '#94a3b8' }} />
          <button onClick={handleBatch} disabled={!file || batchLoading} style={{ background: '#0e7490', color: '#22d3ee', border: '1px solid #22d3ee', borderRadius: '8px', padding: '8px 20px', fontSize: '0.875rem', fontWeight: 600 }}>
            {batchLoading ? 'Processing...' : '⟶ Run Batch'}
          </button>
        </div>

        {batchResults && !batchResults.error && Array.isArray(batchResults) && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1e3a5f' }}>
                  {['#', 'Label', 'Confidence', 'Top Feature'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {batchResults.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #0d1a2e' }}>
                    <td style={{ padding: '8px 12px', color: '#64748b' }}>{i + 1}</td>
                    <td style={{ padding: '8px 12px', color: labelColor(row.label), fontFamily: 'Space Mono', fontWeight: 700 }}>{row.label}</td>
                    <td style={{ padding: '8px 12px', color: '#94a3b8' }}>{(row.confidence * 100).toFixed(1)}%</td>
                    <td style={{ padding: '8px 12px', color: '#22d3ee' }}>{row.top_features?.[0]?.feature || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {batchResults?.error && <p style={{ color: '#f87171', fontSize: '0.875rem' }}>{batchResults.error}</p>}
      </Card>
    </div>
  )
}