import { Link } from 'react-router-dom'
import { TrendingDown, AlertTriangle } from 'lucide-react'
import StatCard from '../components/StatCard'
import ProgressBar from '../components/ProgressBar'
import MilestoneList from '../components/MilestoneList'
import WorkoutCard from '../components/WorkoutCard'
import { useLocalStorage } from '../hooks/useStorage'
import { STORAGE_KEYS, COLORS } from '../utils/constants'
import { DEFAULT_WORKOUTS, DEFAULT_WEIGHTS } from '../utils/defaults'
import {
  getCurrentWeight,
  getLostSoFar,
  getRemaining,
  getProgressPct,
  getWeeksElapsed,
  getWeeksRemaining,
  isOnTrack,
  parseDate,
} from '../utils/calculations'

export default function Home() {
  const [workouts] = useLocalStorage(STORAGE_KEYS.workouts, DEFAULT_WORKOUTS)
  const [weights] = useLocalStorage(STORAGE_KEYS.weights, DEFAULT_WEIGHTS)

  const current = getCurrentWeight(weights)
  const lost = getLostSoFar(current)
  const remaining = getRemaining(current)
  const pct = getProgressPct(current)
  const weekNum = getWeeksElapsed() + 1
  const weeksLeft = getWeeksRemaining()
  const onTrack = isOnTrack(weights)

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const recent = [...workouts]
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .slice(0, 3)

  return (
    <div className="page">
      <header className="home-header">
        <h1 className="app-title">Bronx to 180</h1>
        <p className="home-date">{today}</p>
      </header>

      <section className="current-weight-card">
        <span className="cw-label">Current Weight</span>
        <div className="cw-value">
          {current}
          <span className="cw-unit">lbs</span>
        </div>
        <span
          className={`track-badge ${onTrack ? 'track-good' : 'track-warn'}`}
        >
          {onTrack ? (
            <>
              <TrendingDown size={14} /> On Track
            </>
          ) : (
            <>
              <AlertTriangle size={14} /> Slightly Behind
            </>
          )}
        </span>
      </section>

      <section className="card">
        <ProgressBar pct={pct} />
      </section>

      <section className="stat-grid">
        <StatCard label="Lost So Far" value={lost} unit=" lbs" accent={COLORS.green} />
        <StatCard label="Still to Go" value={remaining} unit=" lbs" />
        <StatCard label="Week #" value={weekNum} />
        <StatCard label="Weeks Left" value={weeksLeft} />
      </section>

      <section className="card">
        <h2 className="section-title">Milestones</h2>
        <MilestoneList currentWeight={current} />
      </section>

      <section className="card">
        <div className="section-head">
          <h2 className="section-title">Recent Workouts</h2>
          <Link to="/log" className="link-sm">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="empty">No workouts logged yet.</p>
        ) : (
          <div className="workout-list">
            {recent.map((w) => (
              <WorkoutCard key={w.id} workout={w} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
