import { useState } from 'react'
import { Plus, ArrowDown, ArrowUp, Minus, Trash2 } from 'lucide-react'
import WeightHistory from '../components/WeightHistory'
import { useLocalStorage } from '../hooks/useStorage'
import { STORAGE_KEYS, COLORS } from '../utils/constants'
import { DEFAULT_WEIGHTS } from '../utils/defaults'
import { getCurrentWeight, todayISO, parseDate } from '../utils/calculations'

function formatDate(iso) {
  const d = parseDate(iso)
  if (isNaN(d)) return iso
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export default function WeightLog() {
  const [weights, setWeights] = useLocalStorage(
    STORAGE_KEYS.weights,
    DEFAULT_WEIGHTS
  )

  const [date, setDate] = useState(todayISO())
  const [weight, setWeight] = useState('')

  const current = getCurrentWeight(weights)

  function handleSubmit(e) {
    e.preventDefault()
    const w = parseFloat(weight)
    if (!Number.isFinite(w)) return
    setWeights((prev) => {
      // Replace an existing entry for the same date, otherwise add.
      const others = prev.filter((entry) => entry.date !== date)
      return [...others, { date, weight: +w.toFixed(1) }]
    })
    setWeight('')
    setDate(todayISO())
  }

  function handleDelete(targetDate) {
    setWeights((prev) => prev.filter((entry) => entry.date !== targetDate))
  }

  // Newest first, with change vs the chronologically previous entry.
  const sortedAsc = [...weights].sort(
    (a, b) => parseDate(a.date) - parseDate(b.date)
  )
  const history = sortedAsc
    .map((entry, i) => {
      const prev = i > 0 ? sortedAsc[i - 1] : null
      const change = prev ? +(entry.weight - prev.weight).toFixed(1) : null
      return { ...entry, change }
    })
    .reverse()

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Weight Log</h1>
      </header>

      <section className="current-weight-card">
        <span className="cw-label">Current Weight</span>
        <div className="cw-value">
          {current}
          <span className="cw-unit">lbs</span>
        </div>
      </section>

      <form className="card form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span className="field-label">Weight (lbs)</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            placeholder="e.g. 226.4"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn btn-primary">
          <Plus size={18} /> Log Weight
        </button>
      </form>

      <section className="card">
        <h2 className="section-title">Progress Chart</h2>
        <WeightHistory weights={weights} />
      </section>

      <section className="card">
        <h2 className="section-title">History</h2>
        {history.length === 0 ? (
          <p className="empty">No weigh-ins yet.</p>
        ) : (
          <ul className="weight-list">
            {history.map((entry) => {
              const lost = entry.change != null && entry.change < 0
              const gained = entry.change != null && entry.change > 0
              const color = lost
                ? COLORS.green
                : gained
                  ? COLORS.red
                  : COLORS.muted
              return (
                <li key={entry.date} className="weight-row">
                  <div className="weight-row-main">
                    <span className="weight-date">{formatDate(entry.date)}</span>
                    <span className="weight-val">{entry.weight} lbs</span>
                  </div>
                  <div className="weight-row-side">
                    {entry.change != null && (
                      <span className="weight-change" style={{ color }}>
                        {lost ? (
                          <ArrowDown size={14} />
                        ) : gained ? (
                          <ArrowUp size={14} />
                        ) : (
                          <Minus size={14} />
                        )}
                        {Math.abs(entry.change)}
                      </span>
                    )}
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label="Delete entry"
                      onClick={() => handleDelete(entry.date)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
