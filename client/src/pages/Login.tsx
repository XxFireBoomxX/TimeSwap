// src/pages/Login.tsx

import { useState } from 'react'
import api from '../api' // <<< ВАЖНО: използвай си api.ts за заявки!
import '../SharedStyles.css';

interface Props {
  onSuccessLogin: (token: string) => void
  onSwitchToRegister: () => void
}

interface LoginResponse {
  access_token: string
}

export default function Login({ onSuccessLogin, onSwitchToRegister }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post<LoginResponse>(
        '/auth/login', // <<< НЕ ти трябва URL, api.ts го оправя!
        { email, password }
      )
      onSuccessLogin(res.data.access_token)
    } catch {
      setError('Невалидни данни или грешка при вход.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <h2>Вход</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Имейл"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Парола"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Моля, изчакай...' : 'Вход'}
        </button>
      </form>
      <button
        className="switch-btn"
        type="button"
        onClick={onSwitchToRegister}
      >
        Нямаш акаунт? Регистрирай се!
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  )
}
