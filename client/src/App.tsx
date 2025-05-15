import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
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
          <Route
            path="/"
            element={
              <div className="card">
                <h2>Добре дошъл!</h2>
                <p>Избери действие, за да започнеш.</p>
                <Link to="/login">
                  <button className="mt-2">Вход</button>
                </Link>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
