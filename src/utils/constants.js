export const START_WEIGHT = 228.6
export const GOAL_WEIGHT = 180
export const START_DATE = '2026-06-04'
export const TARGET_DATE = '2026-11-21'
export const TOTAL_TO_LOSE = 48.6
export const WEEKLY_PACE = 2.0

export const HABITS = [
  'Workout / Walk',
  'Hit 150g Protein',
  '8 Glasses Water',
  '8 Hrs Sleep',
  'Stayed in Cals',
]

export const WORKOUT_TYPES = [
  'Upper Body',
  'Lower Body',
  'Full Body Bootcamp',
  'Arms + Cardio',
  'Cardio Only',
  'Legs + Core',
  'Chest & Back',
  'Shoulders & Arms',
  'Rest Day / Walk',
  'Other',
]

export const MILESTONES = [
  { label: 'First 10 lbs', target: 218.6, lbs: 10 },
  { label: 'First 20 lbs', target: 208.6, lbs: 20 },
  { label: 'Halfway there', target: 204.3, lbs: 24.3 },
  { label: 'First 30 lbs', target: 198.6, lbs: 30 },
  { label: 'First 40 lbs', target: 188.6, lbs: 40 },
  { label: 'GOAL — 180 lbs 🏆', target: 180, lbs: 48.6 },
]

// Storage keys
export const STORAGE_KEYS = {
  workouts: 'b180_workouts',
  weights: 'b180_weights',
  habits: 'b180_habits',
}

// Theme colors (kept in JS for chart components that need inline values)
export const COLORS = {
  bg: '#0F1117',
  card: '#1A1D27',
  border: '#2A2D3A',
  green: '#1D9E75',
  yellow: '#E0A33E',
  red: '#E0564E',
  blue: '#4C8DFF',
  text: '#E8EAED',
  muted: '#8A8F9C',
}
