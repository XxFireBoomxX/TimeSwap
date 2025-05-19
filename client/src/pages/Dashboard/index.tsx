import { useEffect, useState } from 'react'
import NotificationsPanel from './NotificationsPanel'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import '../SharedStyles.css'

export interface Task {
  id: number
  title: string
  description: string
  deadline: string
  reward: number
  status: string
  created_by: number
  claimed_by: number | null
}
export interface LikeNotification {
  task_id: number
  task_title: string
  liked_by_id: number
  liked_by_username: string
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

  // Notifications
  const [notifications, setNotifications] = useState<LikeNotification[]>([])
  const [notifLoading, setNotifLoading] = useState(false)
  const [notifInfo, setNotifInfo] = useState('')

  // --- Fetch Tasks
  const fetchTasks = () => {
    setLoading(true)
    setError('')
    window.axios
      .get(`/tasks/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const data = res.data as { tasks: Task[] }
        setTasks(Array.isArray(data) ? data : data.tasks || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Грешка при зареждане на задачите')
        setLoading(false)
      })
  }

  // --- Fetch Notifications
  const fetchNotifications = () => {
    setNotifLoading(true)
    window.axios
      .get(`/like/notifications`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setNotifications((res.data as { notifications: LikeNotification[] }).notifications || [])
        setNotifLoading(false)
      })
      .catch(() => {
        setNotifInfo('Грешка при зареждане на известията.')
        setNotifLoading(false)
      })
  }

  useEffect(fetchTasks, [token])
  useEffect(fetchNotifications, [token])

  // --- Handlers (предават се като props)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const resetForm = () => {
    setForm(initialForm)
    setEditId(null)
    setFormError('')
    setShowForm(false)
  }
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
        await window.axios.put(`/tasks/${editId}`, {
          title: form.title,
          description: form.description,
          deadline: form.deadline,
          reward: Number(form.reward),
        }, { headers: { Authorization: `Bearer ${token}` } })
      } else {
        await window.axios.post(`/tasks/`, {
          title: form.title,
          description: form.description,
          deadline: form.deadline,
          reward: Number(form.reward),
        }, { headers: { Authorization: `Bearer ${token}` } })
      }
      resetForm()
      fetchTasks()
    } catch {
      setFormError('Грешка при създаване/редакция на задачата.')
    } finally {
      setProcessing(false)
    }
  }
  const handleDelete = async (id: number) => {
    if (!window.confirm('Сигурен ли си, че искаш да изтриеш тази задача?')) return
    setProcessing(true)
    try {
      await window.axios.delete(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      fetchTasks()
    } catch {
      alert('Грешка при изтриване.')
    } finally {
      setProcessing(false)
    }
  }
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
  const handleMatch = async (task_id: number, user_id: number) => {
    setNotifInfo('')
    setNotifLoading(true)
    try {
      await window.axios.post(`/match/confirm`, { task_id, user_id }, { headers: { Authorization: `Bearer ${token}` } })
      setNotifInfo('Успешно създаден match! Задачата е възложена.')
      fetchTasks()
      fetchNotifications()
    } catch (e: any) {
      setNotifInfo(e?.response?.data?.error || 'Грешка при match.')
    } finally {
      setNotifLoading(false)
    }
  }
  const handleClaim = async (id: number) => {
    setProcessing(true)
    try {
      await window.axios.post(`/tasks/${id}/claim`, {}, { headers: { Authorization: `Bearer ${token}` } })
      fetchTasks()
    } catch {
      alert('Грешка при клеймване.')
    } finally {
      setProcessing(false)
    }
  }
  const handleComplete = async (id: number) => {
    setProcessing(true)
    try {
      await window.axios.post(`/tasks/${id}/complete`, {}, { headers: { Authorization: `Bearer ${token}` } })
      fetchTasks()
    } catch {
      alert('Грешка при завършване.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="page-container dashboard-container">
      <NotificationsPanel
        notifications={notifications}
        notifLoading={notifLoading}
        notifInfo={notifInfo}
        onMatch={handleMatch}
      />

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

      {showForm && (
        <TaskForm
          form={form}
          formError={formError}
          processing={processing}
          editId={editId}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        processing={processing}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onClaim={handleClaim}
        onComplete={handleComplete}
      />
    </div>
  )
}
