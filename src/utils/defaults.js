import { START_WEIGHT, START_DATE } from './constants'

// Seed data used the first time the app runs (before anything is in localStorage).
export const DEFAULT_WORKOUTS = [
  {
    id: 1,
    date: '2026-06-02',
    type: 'Arms + Cardio',
    duration: 60,
    notes: 'At the gym with a friend',
  },
]

export const DEFAULT_WEIGHTS = [{ date: START_DATE, weight: START_WEIGHT }]

export const DEFAULT_HABITS = {}
