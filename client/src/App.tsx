// src/App.tsx

import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [token, setToken] = useState<string | null>(null)
  const [showRegister, setShowRegister] = useState(false)

  // При реално приложение пази токена в localStorage и валидирай!
  const handleLogin = (token: string) => {
    setToken(token)
  }

  const handleLogout = () => {
    setToken(null)
  }

  return (
    <div className="fullscreen-center">
      {!token ? (
        showRegister ? (
          <Register
            onSuccessLogin={handleLogin}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <Login
            onSuccessLogin={handleLogin}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )
      ) : (
        <Dashboard token={token} onLogout={handleLogout} />
      )}
    </div>
  )
}
