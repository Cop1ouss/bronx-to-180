import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import HabitToggle from '../components/HabitToggle'
import { useLocalStorage } from '../hooks/useStorage'
import { HABITS, STORAGE_KEYS, COLORS } from '../utils/constants'
import { DEFAULT_HABITS } from '../utils/defaults'
import {
  getTodayHabits,
  getHabitScore,
  getHabitColor,
  todayISO,
  toISODate,
} from '../utils/calculations'

const COLOR_MAP = {
  green: COLORS.green,
  yellow: COLORS.yellow,
  red: COLORS.red,
}

export default function Habits() {
  const [habits, setHabits] = useLocalStorage(STORAGE_KEYS.habits, DEFAULT_HABITS)

  const todayKey = todayISO()
  const todayArr = getTodayHabits(habits)
  const score = getHabitScore(todayArr)
  const scoreColor = getHabitColor(score)

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  function toggle(index) {
    setHabits((prev) => {
      const existing = getTodayHabits(prev)
      const next = existing.map((v, i) => (i === index ? !v : v))
      return { ...prev, [todayKey]: next }
    })
  }

  // Build last-7-days data (oldest -> newest) for the bar chart.
  const chartData = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = toISODate(d)
    const arr = Array.isArray(habits[key]) ? habits[key] : []
    const dayScore = arr.filter(Boolean).length
    chartData.push({
      label: d.toLocaleDateString(undefined, { weekday: 'short' }),
      score: dayScore,
      color: COLOR_MAP[getHabitColor(dayScore)],
    })
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Daily Habits</h1>
        <p className="page-sub">{todayLabel}</p>
      </header>

      <section className="card score-card">
        <span className="score-caption">Today's Score</span>
        <span className={`score-badge score-${scoreColor}`}>{score}/5</span>
      </section>

      <section className="card">
        <div className="habit-toggles">
          {HABITS.map((label, i) => (
            <HabitToggle
              key={label}
              label={label}
              done={todayArr[i]}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Last 7 Days</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, bottom: 0, left: -24 }}
            >
              <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: COLORS.muted, fontSize: 11 }}
                stroke={COLORS.border}
              />
              <YAxis
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                tick={{ fill: COLORS.muted, fontSize: 11 }}
                stroke={COLORS.border}
                width={32}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                contentStyle={{
                  background: COLORS.card,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  color: COLORS.text,
                  fontSize: 12,
                }}
                labelStyle={{ color: COLORS.muted }}
                formatter={(v) => [`${v}/5`, 'Score']}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={34}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}
