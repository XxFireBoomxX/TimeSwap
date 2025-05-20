// src/pages/Dashboard/hooks.ts
import { useState, useCallback } from "react";
import axios from "axios";
import type { Task, LikeNotification } from "./types";

export function useTasks(token: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(() => {
    setLoading(true);
    setError("");
    axios
      .get(`/tasks/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const data = res.data as { tasks: Task[] };
        setTasks(Array.isArray(data) ? data : data.tasks || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Грешка при зареждане на задачите");
        setLoading(false);
      });
  }, [token]);

  return { tasks, loading, error, setTasks, fetchTasks };
}

export function useNotifications(token: string) {
  const [notifications, setNotifications] = useState<LikeNotification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifInfo, setNotifInfo] = useState("");

  const fetchNotifications = useCallback(() => {
    setNotifLoading(true);
    axios
      .get(`/like/notifications`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setNotifications((res.data as { notifications: LikeNotification[] }).notifications || []);
        setNotifLoading(false);
      })
      .catch(() => {
        setNotifInfo("Грешка при зареждане на известията.");
        setNotifLoading(false);
      });
  }, [token]);

  return { notifications, notifLoading, notifInfo, setNotifInfo, fetchNotifications };
}
