import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import hackathonGraphic from './assets/hackathon-graphic.svg'
import naverLogo from './assets/naver-logo.svg'
import { Button } from './components/ui/button'
import Intro from './pages/intro'
import Dashboard from './pages/dashboard'
import BoardPage from './pages/boardpage'
function App() {
  return (
      <Routes>
        <Route path="/" element={<Intro />}>
          {/* Add more nested routes here */}
        </Route>
        <Route path="/dashboard" element={<BoardPage />}>
          {/* Add more nested routes here */}
        </Route>
        <Route path="/" element={<Intro />}>
          {/* Add more nested routes here */}
        </Route>
      </Routes>
  )
}

export default App