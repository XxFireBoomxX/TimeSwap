import { useEffect, useState } from 'react'
import axios from 'axios'
import '../SharedStyles.css'

interface Task {
  id: number
  title: string
  description: string
  deadline: string
  reward: number
  status: string
  created_by: number
  claimed_by: number | null
}

interface Props {
  token: string
  onLogout: () => void
}

const initialForm = {
  title: '',
  description: '',
  deadline: '',
  reward: '',
}

export default function Dashboard({ token, onLogout }: Props) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(initialForm)
  const [formError, setFormError] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [processing, setProcessing] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Fetch tasks
  const fetchTasks = () => {
    setLoading(true)
    setError('')
    axios
      .get(`${import.meta.env.VITE_API_URL}/tasks/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const data = res.data
        setTasks(Array.isArray(data) ? data : data.tasks || [])
      })
      .catch(() => setError('Грешка при зареждане на задачите'))
      .finally(() => setLoading(false))
  }

  useEffect(fetchTasks, [token])

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Reset form
  const resetForm = () => {
    setForm(initialForm)
    setEditId(null)
    setFormError('')
    setShowForm(false)
  }

  // Submit create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setProcessing(true)

    if (!form.title || !form.deadline || !form.reward) {
      setFormError('Попълни всички полета!')
      setProcessing(false)
      return
    }

    try {
      if (editId) {
        // Update
        await axios.put(
          `${import.meta.env.VITE_API_URL}/tasks/${editId}`,
          {
            title: form.title,
            description: form.description,
            deadline: form.deadline,
            reward: Number(form.reward),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        // Create
        await axios.post(
          `${import.meta.env.VITE_API_URL}/tasks/`,
          {
            title: form.title,
            description: form.description,
            deadline: form.deadline,
            reward: Number(form.reward),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
      resetForm()
      fetchTasks()
    } catch {
      setFormError('Грешка при създаване/редакция на задачата.')
    } finally {
      setProcessing(false)
    }
  }

  // Delete task
  const handleDelete = async (id: number) => {
    if (!window.confirm('Сигурен ли си, че искаш да изтриеш тази задача?')) return
    setProcessing(true)
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/tasks/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchTasks()
    } catch {
      alert('Грешка при изтриване.')
    } finally {
      setProcessing(false)
    }
  }

  // Edit task
  const handleEdit = (task: Task) => {
    setEditId(task.id)
    setForm({
      title: task.title,
      description: task.description,
      deadline: task.deadline.slice(0, 16),
      reward: String(task.reward),
    })
    setShowForm(true)
  }

  // Claim task
  const handleClaim = async (id: number) => {
    setProcessing(true)
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks/${id}/claim`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchTasks()
    } catch {
      alert('Грешка при клеймване.')
    } finally {
      setProcessing(false)
    }
  }

  // Complete task
  const handleComplete = async (id: number) => {
    setProcessing(true)
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchTasks()
    } catch {
      alert('Грешка при завършване.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="page-container dashboard-container">
      <div className="header-row">
        <h2 className="page-title">Твоите задачи</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="main-btn"
            style={{ fontSize: 24, padding: "8px 16px", borderRadius: "50%", fontWeight: 900, lineHeight: 1 }}
            title="Създай нова задача"
            onClick={() => { setShowForm(v => !v); setEditId(null); setForm(initialForm) }}
            disabled={processing}
          >+</button>
          <button className="logout-btn" onClick={onLogout} disabled={processing}>
            Изход
          </button>
        </div>
      </div>

      {/* Accordion/Modal/Dropdown форма */}
      {showForm && (
        <form onSubmit={handleSubmit} className="task-form">
          <h4 className="task-form-title">{editId ? 'Редакция на задача' : 'Нова задача'}</h4>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Заглавие" required disabled={processing} className="task-input" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Описание" className="task-input" style={{ resize: 'vertical', minHeight: 40 }} disabled={processing} />
          <input name="deadline" value={form.deadline} onChange={handleChange} placeholder="Дедлайн" type="datetime-local" required disabled={processing} className="task-input" />
          <input name="reward" value={form.reward} onChange={handleChange} placeholder="Награда" type="number" min={0} required disabled={processing} className="task-input" />
          {formError && <div className="error">{formError}</div>}
          <div className="task-form-actions">
            <button type="submit" className="main-btn" disabled={processing}>{editId ? 'Запази' : 'Добави'}</button>
            <button type="button" className="cancel-btn" onClick={resetForm} disabled={processing}>Откажи</button>
          </div>
        </form>
      )}

      {/* Списък със задачите */}
      {loading ? (
        <p className="info">Зареждане...</p>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
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
                  <button onClick={() => handleEdit(task)} disabled={processing} className="edit-btn">Редакция</button>
                  <button onClick={() => handleDelete(task.id)} disabled={processing} className="delete-btn">Изтрий</button>
                  {task.status === "open" && (
                    <button onClick={() => handleClaim(task.id)} disabled={processing} className="claim-btn">Claim</button>
                  )}
                  {task.status === "claimed" && (
                    <button onClick={() => handleComplete(task.id)} disabled={processing} className="complete-btn">Complete</button>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
