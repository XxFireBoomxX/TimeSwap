import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="text-center">
          <h1>TimeSwap</h1>
          <p>Платформата за размяна на задачи между студенти</p>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
