import { START_WEIGHT, GOAL_WEIGHT } from '../utils/constants'

export default function ProgressBar({ pct }) {
  const clamped = Math.min(100, Math.max(0, pct))
  return (
    <div className="progress-wrap">
      <div className="progress-ends">
        <span>{START_WEIGHT} lbs</span>
        <span className="progress-pct">{clamped}%</span>
        <span>{GOAL_WEIGHT} lbs</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}
