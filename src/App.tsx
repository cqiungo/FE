import { Routes, Route } from 'react-router-dom'
import './App.css'
import Intro from './pages/intro'
import Dashboard from './pages/dashboard'
import BoardPage from './pages/boardpage'
import MyCalendar from './pages/calendar-page'
import Signup from './pages/auth/signup'
import Login from './pages/auth/login'
function App() {
  return (
      <Routes>
        <Route path="/" element={<Intro />}>
          {/* Add more nested routes here */}
        </Route>
        <Route path="/dashboard" element={<BoardPage />}>
          {/* Add more nested routes here */}
        </Route>
        <Route path="/boardpage" element={<Dashboard />}>
          {/* Add more nested routes here */}
        </Route>
        <Route path="/calendar" element={<MyCalendar />}>
          {/* Add more nested routes here */}
        </Route>
        <Route path="/register" element={<Signup />}>
          {/* Add more nested routes here */}
        </Route>
        <Route path="/login" element={<Login />}>
          {/* Add more nested routes here */}
        </Route>
      </Routes>
  )
}

export default App