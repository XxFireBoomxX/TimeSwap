import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css'

interface LoginResponse {
  access_token: string
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post<LoginResponse>('http://localhost:5000/auth/login', {
        email,
        password,
      })
      localStorage.setItem('token', res.data.access_token)
      setLoading(false)
      navigate('/tasks')
    } catch (err) {
      setLoading(false)
      setError('Невалидни данни или грешка при вход. 😠')
    }
  }

  return (
    <div className="login-page-bg">
      <div className="login-container dark">
        <h2>Вход</h2>
        <form onSubmit={handleLogin} className={error ? 'shake' : ''}>
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
          <button type="submit" disabled={loading || !email || !password}>
            {loading ? 'Влизам...' : 'Вход'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}
