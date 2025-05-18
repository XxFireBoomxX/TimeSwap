import '../pages/Login.css'

const tasks = [
  { id: 1, title: 'Изчисти трона 🏰', reward: 10, status: 'open' },
  { id: 2, title: 'Поръчай армия на наемници', reward: 20, status: 'in progress' },
  { id: 3, title: 'Поръчай вечеря за Алина', reward: 999, status: 'done' }
]

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f4f0fb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="login-container" style={{ width: 410, maxWidth: '96vw', alignItems: 'stretch' }}>
        <h2>👑 Твоят Dashboard</h2>
        <div style={{ marginBottom: 20, color: "#7e57c2", fontWeight: 600, textAlign: 'center' }}>
          Добре дошъл, Принце! Ето ги задачите.
        </div>
        <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
          {tasks.map(task => (
            <li key={task.id} style={{
              background: "#faf8ff",
              border: "1.3px solid #cbbde2",
              borderRadius: 8,
              padding: "14px 16px",
              marginBottom: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 1px 6px 0 rgba(140, 54, 200, 0.06)"
            }}>
              <div>
                <div style={{ fontWeight: 600, color: "#8e24aa" }}>{task.title}</div>
                <div style={{ fontSize: 13, color: "#b39ddb" }}>Статус: {task.status}</div>
              </div>
              <div style={{
                fontWeight: 600,
                color: "#fff",
                background: "#8e24aa",
                borderRadius: 7,
                padding: "6px 14px",
                fontSize: 15,
                minWidth: 54,
                textAlign: 'center'
              }}>
                +{task.reward} 💰
              </div>
            </li>
          ))}
        </ul>
        <button style={{ marginTop: 8 }}>Добави нова задача</button>
      </div>
    </div>
  )
}
