// src/pages/Dashboard/TaskList.tsx
import type { Task } from "./types"

interface Props {
  tasks: Task[]
  loading: boolean
  error: string
  processing: boolean
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
  onClaim: (id: number) => void
  onComplete: (id: number) => void
}

export default function TaskList({
  tasks, loading, error, processing,
  onEdit, onDelete, onClaim, onComplete
}: Props) {
  if (loading) return <p className="info">Зареждане...</p>
  if (error) return <div className="error">{error}</div>
  return (
    <ul className="task-list">
      {tasks.length === 0 ? (
        <li className="info">Няма задачи.</li>
      ) : (
        tasks.map(task => (
          <li key={task.id} className="task-card">
            <strong className="task-title">{task.title}</strong>
            <div className="task-desc">{task.description}</div>
            <div className="task-meta">
              Дедлайн: {new Date(task.deadline).toLocaleString('bg-BG')}
            </div>
            <div className="task-meta">
              Награда: {task.reward} лв. | Статус: {task.status}
            </div>
            <div className="task-actions">
              <button onClick={() => onEdit(task)} disabled={processing} className="edit-btn">Редакция</button>
              <button onClick={() => onDelete(task.id)} disabled={processing} className="delete-btn">Изтрий</button>
              {task.status === "open" && (
                <button onClick={() => onClaim(task.id)} disabled={processing} className="claim-btn">Claim</button>
              )}
              {task.status === "claimed" && (
                <button onClick={() => onComplete(task.id)} disabled={processing} className="complete-btn">Complete</button>
              )}
            </div>
          </li>
        ))
      )}
    </ul>
  )
}
