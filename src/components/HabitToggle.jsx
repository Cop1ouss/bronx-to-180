import { Check } from 'lucide-react'

export default function HabitToggle({ label, done, onToggle }) {
  return (
    <button
      type="button"
      className={`habit-toggle${done ? ' habit-done' : ''}`}
      onClick={onToggle}
      aria-pressed={done}
    >
      <span className="habit-check">{done && <Check size={16} />}</span>
      <span className="habit-label">{label}</span>
    </button>
  )
}
