import { useState } from 'react'
import { Clock, Calendar, Trash2, ChevronDown } from 'lucide-react'
import { parseDate } from '../utils/calculations'

function formatDate(iso) {
  const d = parseDate(iso)
  if (isNaN(d)) return iso
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export default function WorkoutCard({ workout, onDelete }) {
  const [open, setOpen] = useState(false)
  const hasNotes = Boolean(workout.notes && workout.notes.trim())

  return (
    <div className="workout-card">
      <button
        type="button"
        className="workout-head"
        onClick={() => hasNotes && setOpen((o) => !o)}
      >
        <div className="workout-main">
          <span className="workout-type">{workout.type}</span>
          <div className="workout-meta">
            <span>
              <Calendar size={13} /> {formatDate(workout.date)}
            </span>
            <span>
              <Clock size={13} /> {workout.duration} min
            </span>
          </div>
        </div>
        {hasNotes && (
          <ChevronDown
            size={18}
            className={`chevron${open ? ' chevron-open' : ''}`}
          />
        )}
      </button>

      {open && hasNotes && <p className="workout-notes">{workout.notes}</p>}

      {onDelete && (
        <button
          type="button"
          className="icon-btn workout-delete"
          aria-label="Delete workout"
          onClick={() => onDelete(workout.id)}
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
}
