import { useState } from 'react'
import axios from 'axios'
import './Login.css'

interface LoginResponse {
  access_token: string
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [token, setToken] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post<LoginResponse>('http://localhost:5000/auth/login', {
        email,
        password,
      })
      setToken(res.data.access_token)
      setError('')
    } catch (err) {
      setError('Невалидни данни или грешка при вход.')
    }
  }

  return (
    <div className="login-container">
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
        <button type="submit">Вход</button>
      </form>
      {error && <p className="error">{error}</p>}
      {token && <p className="success">Успешен вход! 🎉</p>}
    </div>
  )
}
