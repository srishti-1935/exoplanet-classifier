import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

const API = 'http://localhost:8000'

const Card = ({ children, title, style }) => (
  <div style={{ background: '#0d1525', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '1.5rem', ...style }}>
    {title && <h2 style={{ fontSize: '0.875rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>{title}</h2>}
    {children}
  </div>
)

export default function Insights() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/model-stats`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => setStats({ error: true }))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ color: '#64748b', padding: '2rem', fontFamily: 'Space Mono' }}>Loading model stats...</p>
  if (!stats || stats.error) return <p style={{ color: '#f87171', padding: '2rem' }}>Could not load stats. Is the backend running?</p>

  const metricCards = [
    { label: 'Accuracy', value: `${(stats.accuracy * 100).toFixed(1)}%`, color: '#22d3ee' },
    { label: 'Precision', value: `${(stats.precision * 100).toFixed(1)}%`, color: '#4ade80' },
    { label: 'Recall', value: `${(stats.recall * 100).toFixed(1)}%`, color: '#fbbf24' },
    { label: 'F1 Score', value: `${(stats.f1 * 100).toFixed(1)}%`, color: '#a78bfa' },
    { label: 'ROC-AUC', value: stats.roc_auc?.toFixed(3), color: '#fb923c' },
  ]

  const featureData = stats.feature_importance?.map(f => ({ name: f.feature.replace('koi_', ''), value: parseFloat((f.importance * 100).toFixed(2)) })) || []

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontFamily: 'Space Mono', fontSize: '1.5rem', color: '#22d3ee', marginBottom: '0.25rem' }}>Model Insights</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Live performance metrics from the trained classifier</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
        {metricCards.map(({ label, value, color }) => (
          <Card key={label}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Space Mono', fontSize: '1.75rem', fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
            </div>
          </Card>
        ))}
      </div>

      {featureData.length > 0 && (
        <Card title="Feature Importance">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={featureData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={90} />
              <Tooltip contentStyle={{ background: '#0d1525', border: '1px solid #1e3a5f', borderRadius: '8px', color: '#e2e8f0', fontSize: '12px' }} formatter={v => [`${v}%`, 'Importance']} />
              <Bar dataKey="value" fill="#22d3ee" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {stats.confusion_matrix && (
        <Card title="Confusion Matrix">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: '4px', fontSize: '0.8rem', maxWidth: '360px' }}>
            <div />
            {['Confirmed', 'Candidate', 'False Pos.'].map(l => (
              <div key={l} style={{ textAlign: 'center', color: '#64748b', padding: '4px', fontSize: '0.7rem' }}>{l}</div>
            ))}
            {stats.confusion_matrix.map((row, i) => (
              <>
                <div key={`label-${i}`} style={{ color: '#64748b', fontSize: '0.7rem', display: 'flex', alignItems: 'center', paddingRight: '8px' }}>
                  {['Confirmed', 'Candidate', 'False Pos.'][i]}
                </div>
                {row.map((cell, j) => (
                  <div key={j} style={{
                    background: i === j ? '#0e4f6a' : '#0a1628',
                    border: `1px solid ${i === j ? '#22d3ee' : '#1e3a5f'}`,
                    borderRadius: '6px',
                    padding: '10px 4px',
                    textAlign: 'center',
                    fontFamily: 'Space Mono',
                    color: i === j ? '#22d3ee' : '#64748b',
                    fontWeight: i === j ? 700 : 400
                  }}>{cell}</div>
                ))}
              </>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}