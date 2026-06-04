import { Check, Target } from 'lucide-react'
import { MILESTONES } from '../utils/constants'

export default function MilestoneList({ currentWeight }) {
  // The "current target" is the first milestone not yet hit.
  const currentIdx = MILESTONES.findIndex((m) => currentWeight > m.target)

  return (
    <ul className="milestone-list">
      {MILESTONES.map((m, i) => {
        const hit = currentWeight <= m.target
        const isCurrent = i === currentIdx
        return (
          <li
            key={m.label}
            className={`milestone${hit ? ' milestone-hit' : ''}${
              isCurrent ? ' milestone-current' : ''
            }`}
          >
            <span className="milestone-icon">
              {hit ? <Check size={16} /> : isCurrent ? <Target size={16} /> : null}
            </span>
            <span className="milestone-label">{m.label}</span>
            <span className="milestone-target">{m.target} lbs</span>
          </li>
        )
      })}
    </ul>
  )
}
