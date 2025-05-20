import React from 'react'
import type { Task } from './types'

interface Props {
  task: Task
  processing: boolean
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
  onClaim: (id: number) => void
  onComplete: (id: number) => void
}

export default function TaskCard({
  task,
  processing,
  onEdit,
  onDelete,
  onClaim,
  onComplete
}: Props) {
  return (
    <li className="task-card">
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
  )
}
