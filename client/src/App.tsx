import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BrowseTasks from './pages/BrowseTasks'

export default function App() {
  const [token, setToken] = useState<string | null>(null)
  const [showRegister, setShowRegister] = useState(false)
  const [view, setView] = useState<'dashboard' | 'browse'>('dashboard')

  // --- On first load: вземи token от localStorage, ако има
  useEffect(() => {
    const saved = localStorage.getItem('token')
    if (saved) setToken(saved)
  }, [])

  // --- При login: запази token-а в localStorage
  const handleLogin = (token: string) => {
    setToken(token)
    localStorage.setItem('token', token)
    setView('dashboard')
  }

  // --- При logout: изтрий го!
  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('token')
    setView('dashboard')
  }

  if (!token) {
    return (
      <div className="fullscreen-center">
        {showRegister ? (
          <Register
            onSuccessLogin={handleLogin}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <Login
            onSuccessLogin={handleLogin}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    )
  }

  // Вече си логнат!
  return (
    <div className="fullscreen-center">
      <div className="page-container" style={{ gap: 0, paddingTop: 16, paddingBottom: 0, boxShadow: 'none', background: 'none', maxWidth: 540 }}>
        <div className="header-row" style={{ width: "100%", marginBottom: 20, marginTop: 6 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className={`main-btn${view === 'dashboard' ? ' active-btn' : ''}`}
              onClick={() => setView('dashboard')}
              style={{ minWidth: 120 }}
            >
              Твоите задачи
            </button>
            <button
              className={`main-btn${view === 'browse' ? ' active-btn' : ''}`}
              onClick={() => setView('browse')}
              style={{ minWidth: 120 }}
            >
              Общи задачи
            </button>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Изход
          </button>
        </div>
        <div style={{ width: "100%" }}>
          {view === 'dashboard' && token && <Dashboard token={token} onLogout={handleLogout} />}
          {view === 'browse' && token && <BrowseTasks token={token} />}
        </div>
      </div>
    </div>
  )
}
