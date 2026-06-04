import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import LogWorkout from './pages/LogWorkout'
import WeightLog from './pages/WeightLog'
import Habits from './pages/Habits'

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/log" element={<LogWorkout />} />
          <Route path="/weight" element={<WeightLog />} />
          <Route path="/habits" element={<Habits />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
