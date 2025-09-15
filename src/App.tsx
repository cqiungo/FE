import { Routes, Route } from 'react-router-dom'
import './App.css'
import Intro from './pages/intro'
import Dashboard from './pages/dashboard'
import BoardPage from './pages/boardpage'
import MyCalendar from './pages/calendar-page'
import Signup from './pages/auth/signup'
import Login from './pages/auth/login'
import { RequireAuth } from './components/RequireAuth'
function App() {
  return (
      <Routes>
        <Route path="/" element={<Intro />}>
          {/* Add more nested routes here */}
        </Route>
        <Route path="/dashboard" element={
          <RequireAuth>
            <BoardPage></BoardPage>
          </RequireAuth>    
          }>
          {/* Add more nested routes here */}
        </Route>
        <Route path="/taskview" element={
          <RequireAuth>
            <Dashboard></Dashboard>
          </RequireAuth>
          }>
          
        </Route>
        <Route path="/calendar" element={
          <RequireAuth>
            <MyCalendar></MyCalendar>
          </RequireAuth>} />
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