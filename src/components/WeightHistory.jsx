import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  START_WEIGHT,
  GOAL_WEIGHT,
  START_DATE,
  TARGET_DATE,
  WEEKLY_PACE,
  COLORS,
} from '../utils/constants'
import { parseDate, toISODate } from '../utils/calculations'

function shortDate(iso) {
  const d = parseDate(iso)
  if (isNaN(d)) return iso
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

// Build a merged dataset of actual weights + the target-pace line.
function buildData(weights) {
  const start = parseDate(START_DATE)
  const target = parseDate(TARGET_DATE)

  // Sorted actual entries.
  const actual = [...weights].sort(
    (a, b) => parseDate(a.date) - parseDate(b.date)
  )

  // Collect every date we want an x-axis point for.
  const dateSet = new Set(actual.map((w) => w.date))
  dateSet.add(toISODate(start))
  dateSet.add(toISODate(target))

  const dates = [...dateSet].sort((a, b) => parseDate(a) - parseDate(b))

  const totalWeeks = (target - start) / (1000 * 60 * 60 * 24 * 7)

  return dates.map((date) => {
    const d = parseDate(date)
    const weeksFromStart = (d - start) / (1000 * 60 * 60 * 24 * 7)

    // Target pace: lose WEEKLY_PACE per week, floored at the goal weight.
    let target_pace = START_WEIGHT - WEEKLY_PACE * weeksFromStart
    if (totalWeeks > 0) {
      // Snap the very last point to the goal so the dashed line lands on 180.
      if (date === toISODate(target)) target_pace = GOAL_WEIGHT
    }
    target_pace = Math.max(GOAL_WEIGHT, +target_pace.toFixed(1))

    const match = actual.find((w) => w.date === date)

    return {
      date,
      label: shortDate(date),
      actual: match ? match.weight : null,
      target: target_pace,
    }
  })
}

export default function WeightHistory({ weights }) {
  const data = buildData(weights)

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fill: COLORS.muted, fontSize: 11 }}
            stroke={COLORS.border}
            minTickGap={20}
          />
          <YAxis
            domain={[GOAL_WEIGHT - 4, Math.ceil(START_WEIGHT + 2)]}
            tick={{ fill: COLORS.muted, fontSize: 11 }}
            stroke={COLORS.border}
            width={44}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              color: COLORS.text,
              fontSize: 12,
            }}
            labelStyle={{ color: COLORS.muted }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: COLORS.muted }}
            iconType="plainline"
          />
          <Line
            type="monotone"
            dataKey="target"
            name="Target Pace"
            stroke={COLORS.red}
            strokeWidth={2}
            strokeDasharray="6 5"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual"
            stroke={COLORS.blue}
            strokeWidth={2.5}
            dot={{ r: 3, fill: COLORS.blue }}
            connectNulls
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
