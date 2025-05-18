import React from 'react'
import '../SharedStyles.css';

interface HomeProps {
  onGoToLogin: () => void
  onGoToRegister: () => void
}

export default function Home({ onGoToLogin, onGoToRegister }: HomeProps) {
  return (
    <div className="page-container" style={{ maxWidth: 400 }}>
      <h2>Добре дошъл в TimeSwap!</h2>
      <p style={{
        marginBottom: 30,
        color: '#8e24aa',
        fontWeight: 500,
        textAlign: 'center'
      }}>
        Платформа за размяна на задачи, време и услуги.<br />
        Влез или си създай акаунт, за да започнеш.
      </p>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <button
          className="main-btn"
          onClick={onGoToLogin}
          style={{
            width: '100%',
            padding: '12px 0',
            background: '#8e24aa',
            color: '#fff',
            fontWeight: 600,
            border: 'none',
            borderRadius: 8,
            fontSize: '1.08rem',
            letterSpacing: '1px',
            boxShadow: '0 1px 8px 0 rgba(87, 33, 135, 0.08)'
          }}
        >
          Вход
        </button>
        <button
          className="main-btn"
          onClick={onGoToRegister}
          style={{
            width: '100%',
            padding: '12px 0',
            background: '#232339',
            color: '#b39ddb',
            fontWeight: 600,
            border: 'none',
            borderRadius: 8,
            fontSize: '1.08rem',
            letterSpacing: '1px',
            boxShadow: '0 1px 8px 0 rgba(87, 33, 135, 0.04)'
          }}
        >
          Регистрация
        </button>
      </div>
    </div>
  )
}
