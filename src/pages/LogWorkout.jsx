import { useState } from 'react'
import { Plus } from 'lucide-react'
import WorkoutCard from '../components/WorkoutCard'
import { useLocalStorage } from '../hooks/useStorage'
import { STORAGE_KEYS, WORKOUT_TYPES } from '../utils/constants'
import { DEFAULT_WORKOUTS } from '../utils/defaults'
import { todayISO, parseDate } from '../utils/calculations'

export default function LogWorkout() {
  const [workouts, setWorkouts] = useLocalStorage(
    STORAGE_KEYS.workouts,
    DEFAULT_WORKOUTS
  )

  const [date, setDate] = useState(todayISO())
  const [type, setType] = useState(WORKOUT_TYPES[0])
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const dur = parseInt(duration, 10)
    const entry = {
      id: Date.now(),
      date,
      type,
      duration: Number.isFinite(dur) ? dur : 0,
      notes: notes.trim(),
    }
    setWorkouts((prev) => [...prev, entry])
    // Reset for the next entry.
    setDate(todayISO())
    setType(WORKOUT_TYPES[0])
    setDuration('')
    setNotes('')
  }

  function handleDelete(id) {
    setWorkouts((prev) => prev.filter((w) => w.id !== id))
  }

  const history = [...workouts].sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
  )

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Log Workout</h1>
        <p className="page-sub">
          {workouts.length} session{workouts.length === 1 ? '' : 's'} logged
        </p>
      </header>

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
          <span className="field-label">Workout Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {WORKOUT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Duration (min)</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="e.g. 45"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Notes</span>
          <textarea
            rows={3}
            placeholder="How did it go?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>

        <button type="submit" className="btn btn-primary">
          <Plus size={18} /> Save Workout
        </button>
      </form>

      <section className="card">
        <h2 className="section-title">History</h2>
        {history.length === 0 ? (
          <p className="empty">No workouts yet — log your first one above.</p>
        ) : (
          <div className="workout-list">
            {history.map((w) => (
              <WorkoutCard key={w.id} workout={w} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
