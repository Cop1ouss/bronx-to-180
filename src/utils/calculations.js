import {
  START_WEIGHT,
  GOAL_WEIGHT,
  START_DATE,
  TARGET_DATE,
  HABITS,
} from './constants'

// --- date helpers ---------------------------------------------------------

// Parse a 'YYYY-MM-DD' string as a local date (avoids UTC off-by-one).
export function parseDate(str) {
  if (!str) return new Date(NaN)
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

// Format a Date as 'YYYY-MM-DD' (local).
export function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayISO() {
  return toISODate(new Date())
}

function diffInWeeks(from, to) {
  const ms = to - from
  return ms / (1000 * 60 * 60 * 24 * 7)
}

// --- weight calculations --------------------------------------------------

// Latest weight entry by date. Falls back to START_WEIGHT if none.
export function getCurrentWeight(weights) {
  if (!weights || weights.length === 0) return START_WEIGHT
  const sorted = [...weights].sort((a, b) => parseDate(a.date) - parseDate(b.date))
  return sorted[sorted.length - 1].weight
}

export function getLostSoFar(currentWeight) {
  return Math.max(0, +(START_WEIGHT - currentWeight).toFixed(1))
}

export function getRemaining(currentWeight) {
  return Math.max(0, +(currentWeight - GOAL_WEIGHT).toFixed(1))
}

// 0–100 progress toward the goal.
export function getProgressPct(currentWeight) {
  const total = START_WEIGHT - GOAL_WEIGHT
  if (total <= 0) return 100
  const lost = START_WEIGHT - currentWeight
  const pct = (lost / total) * 100
  return Math.min(100, Math.max(0, +pct.toFixed(1)))
}

// --- time calculations ----------------------------------------------------

export function getWeeksElapsed() {
  const weeks = diffInWeeks(parseDate(START_DATE), new Date())
  return Math.max(0, Math.floor(weeks))
}

export function getWeeksRemaining() {
  const weeks = diffInWeeks(new Date(), parseDate(TARGET_DATE))
  return Math.max(0, Math.ceil(weeks))
}

// Pace (lbs/week) still required to hit the goal by the target date.
export function getPaceNeeded(currentWeight) {
  const remaining = currentWeight - GOAL_WEIGHT
  if (remaining <= 0) return 0
  const weeksLeft = diffInWeeks(new Date(), parseDate(TARGET_DATE))
  if (weeksLeft <= 0) return remaining // out of time — show full remaining
  return +(remaining / weeksLeft).toFixed(2)
}

// Average weekly loss based on logged history.
export function getAvgWeeklyLoss(weights) {
  if (!weights || weights.length < 2) return 0
  const sorted = [...weights].sort((a, b) => parseDate(a.date) - parseDate(b.date))
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const weeks = diffInWeeks(parseDate(first.date), parseDate(last.date))
  if (weeks <= 0) return 0
  const lost = first.weight - last.weight
  return +(lost / weeks).toFixed(2)
}

// On track if averaging at least 1.5 lbs/week of loss.
export function isOnTrack(weights) {
  return getAvgWeeklyLoss(weights) >= 1.5
}

// --- habit calculations ---------------------------------------------------

// Returns today's habit array (length === HABITS.length), defaulting to all false.
export function getTodayHabits(habits) {
  const key = todayISO()
  const today = habits && habits[key]
  if (Array.isArray(today) && today.length === HABITS.length) return today
  return HABITS.map(() => false)
}

export function getHabitScore(habitsArray) {
  if (!Array.isArray(habitsArray)) return 0
  return habitsArray.filter(Boolean).length
}

// Color bucket for a habit score (used by badges and bars).
export function getHabitColor(score) {
  if (score >= 4) return 'green'
  if (score >= 2) return 'yellow'
  return 'red'
}
