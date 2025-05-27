import { useEffect, useState } from "react";
import api from "../api";

interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  reward: number;
  status: string;
  created_by: number;
  claimed_by: number | null;
}

interface Props {
  token: string;
}

export default function BrowseTasks({ token }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [minReward, setMinReward] = useState('');
  const [maxReward, setMaxReward] = useState('');
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<string>("");

  const fetchTasks = () => {
    setLoading(true);
    let params: any = {};
    if (minReward) params.reward_min = minReward;
    if (maxReward) params.reward_max = maxReward;
    api
      .get('/tasks/browse', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then(res => {
        const data = res.data as { tasks: Task[] };
        setTasks(data.tasks || []);
        setLoading(false);
      })
      .catch(() => {
        setInfo("Грешка при зареждане на задачите");
        setLoading(false);
      });
  };

  useEffect(fetchTasks, [token]);

  const handleLike = async (taskId: number) => {
    try {
      await api.post(`/like/task/${taskId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setInfo("Задачата е харесана! Очаквай авторът да я потвърди.");
      fetchTasks();
    } catch (e: any) {
      setInfo(e?.response?.data?.error || "Не може да харесаш тази задача.");
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Общи задачи (размяна)</h2>
      <div className="filters" style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          type="number"
          placeholder="Мин. награда"
          value={minReward}
          onChange={e => setMinReward(e.target.value)}
          className="task-input"
          style={{ width: 110 }}
        />
        <input
          type="number"
          placeholder="Макс. награда"
          value={maxReward}
          onChange={e => setMaxReward(e.target.value)}
          className="task-input"
          style={{ width: 110 }}
        />
        <button className="main-btn" onClick={fetchTasks}>Филтрирай</button>
      </div>
      {loading ? (
        <p className="info">Зареждане...</p>
      ) : (
        <ul className="task-list">
          {tasks.length === 0 ? (
            <li className="info">Няма чужди задачи.</li>
          ) : (
            tasks.map(task => (
              <li key={task.id} className="task-card">
                <strong className="task-title">{task.title}</strong>
                <div className="task-desc">{task.description}</div>
                <div className="task-meta">
                  Дедлайн: {new Date(task.deadline).toLocaleString('bg-BG')}
                </div>
                <div className="task-meta">
                  Награда: {task.reward} лв.
                </div>
                <button
                  className="main-btn"
                  onClick={() => handleLike(task.id)}
                  style={{ marginTop: 10, minWidth: 100 }}
                >🤍 Харесай</button>
              </li>
            ))
          )}
        </ul>
      )}
      {info && <div style={{ marginTop: 18 }} className="info">{info}</div>}
    </div>
  );
}
