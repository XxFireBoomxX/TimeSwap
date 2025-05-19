import React from 'react'
import type { LikeNotification } from './index'

interface Props {
  notifications: LikeNotification[]
  notifLoading: boolean
  notifInfo: string
  onMatch: (task_id: number, user_id: number) => void
}

export default function NotificationsPanel({ notifications, notifLoading, notifInfo, onMatch }: Props) {
  return (
    <div style={{ width: "100%", marginBottom: 18, borderRadius: 10, background: "#232339", boxShadow: "0 2px 16px 0 rgba(87,33,135,0.06)", padding: 12 }}>
      <strong style={{ color: "#b39ddb" }}>Известия: харесани задачи</strong>
      {notifLoading ? (
        <div className="info">Зареждане...</div>
      ) : notifications.length === 0 ? (
        <div className="info">Никой още не е харесал твоите задачи... 😢</div>
      ) : (
        <ul style={{ padding: 0, margin: 0 }}>
          {notifications.map((n, i) => (
            <li key={i} style={{ listStyle: "none", margin: "8px 0", borderBottom: "1px solid #3c2a55", paddingBottom: 6 }}>
              <span style={{ color: "#fff", fontWeight: 500 }}>{n.liked_by_username}</span>
              {" "}иска да изпълни <b style={{ color: "#b39ddb" }}>{n.task_title}</b>
              <button
                className="main-btn"
                style={{ marginLeft: 12, padding: "5px 14px", fontSize: 13 }}
                onClick={() => onMatch(n.task_id, n.liked_by_id)}
                disabled={notifLoading}
              >Match!</button>
            </li>
          ))}
        </ul>
      )}
      {notifInfo && <div className="info" style={{ marginTop: 10 }}>{notifInfo}</div>}
    </div>
  )
}
