import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, Scale, CheckSquare } from 'lucide-react'

const TABS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/log', label: 'Log', icon: Dumbbell, end: false },
  { to: '/weight', label: 'Weight', icon: Scale, end: false },
  { to: '/habits', label: 'Habits', icon: CheckSquare, end: false },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `nav-item${isActive ? ' nav-item-active' : ''}`
          }
        >
          <Icon size={22} strokeWidth={2} />
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
