# PRD: Bronx to 180

| | |
| --- | --- |
| **Owner** | Dajoni Gomez |
| **Status** | Ship (in daily use until Nov 21, 2026) |
| **Phase color** | Ruby |
| **Live** | https://cop1ouss.github.io/bronx-to-180/ |

## Problem

Fitness apps want accounts, subscriptions and your data. I needed one goal tracked the same way every day, on my phone, with nothing leaving the device.

## Goal

Reach **180 lbs by November 21, 2026**, and make the daily check-in take less than a minute.

## Users

- **Me.**
- The code is a template anyone can fork and set to their own goal in `src/utils/constants.js`.

## Scope

**In:**
- **Home:** progress, milestones and an "on track" status.
- **Log:** workouts.
- **Weight:** weigh-ins with a chart against the target pace.
- **Habits:** 5 daily toggles with a 7-day chart.
- Data in `localStorage`.
- GitHub Pages deploy.

**Out:**
- A backend.
- Accounts.
- Calorie databases.
- Social features.

## Requirements

1. Mobile-first: 430 px max width, usable with one thumb.
2. All data in `localStorage` (`b180_workouts`, `b180_weights`, `b180_habits`).
3. Goal, dates, habits and milestones are configurable in one file.
4. `npm run lint` and `npm run build` pass in CI on every PR.
5. No high-severity vulnerabilities in production dependencies (`npm audit` in CI).

## Finish line

- Goal weight reached on or before Nov 21, 2026.
- After that, decide: keep it public as a template, make it private, or archive it.

## Risks

- **Bundle size** is over 500 kB because of Recharts. Fine for now. Code-split if load time matters.
- **Personal data in public.** Mitigation: the post-goal visibility decision above.

---

<sub>© 2026 Dajoni Gomez · Uncook™ · part of the [journey log](https://cop1ouss.github.io/Cop1ouss/)</sub>
