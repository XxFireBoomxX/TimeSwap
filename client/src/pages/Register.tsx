// src/pages/Register.tsx

import { useState } from 'react'
import axios from 'axios'
import '../SharedStyles.css';

interface Props {
  onSuccessLogin: (token: string) => void
  onSwitchToLogin: () => void
}

interface LoginResponse {
  access_token: string
}

export default function Register({ onSuccessLogin, onSwitchToLogin }: Props) {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        { email, username, password }
      )
      const res = await axios.post<LoginResponse>(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password }
      )
      onSuccessLogin(res.data.access_token)
    } catch {
      setError('Грешка при регистрация (може би вече има такъв email/потребител)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Потребителско име"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Имейл"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Парола"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Моля, изчакай...' : 'Регистрация'}
        </button>
      </form>
      <button
        className="switch-btn"
        type="button"
        onClick={onSwitchToLogin}
      >
        Вече имаш акаунт? Влез!
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  )
}
