import { useState, useEffect } from "react";
import { todayRepository } from "@/services/database/repositories/TodayRepository";
import { Session, TaskSlot, Task } from "@/features/today/types";
import { useToast } from "@/hooks/useToast";

const toast = useToast();

export function useNotes() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await todayRepository.getTodaySession();
        setSession(data);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const addTask = async (title: string, slotType: string, orderIndex: number): Promise<string> => {
    const taskId = await todayRepository.addTask(title, slotType, orderIndex);
    // Refresh session
    const updatedSession = await todayRepository.getTodaySession();
    setSession(updatedSession);
    return taskId;
  };

  const updateTask = async (taskId: string, updates: {
    title?: string;
    completed?: boolean;
    orderIndex?: number;
  }): Promise<void> => {
    await todayRepository.updateTask(taskId, updates);
    // Refresh session
    const updatedSession = await todayRepository.getTodaySession();
    setSession(updatedSession);
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    await todayRepository.deleteTask(taskId);
    // Refresh session
    const updatedSession = await todayRepository.getTodaySession();
    setSession(updatedSession);
  };

  const toggleTaskCompletion = async (taskId: string): Promise<void> => {
    await todayRepository.toggleTaskCompletion(taskId);
    // Refresh session
    const updatedSession = await todayRepository.getTodaySession();
    setSession(updatedSession);
  };

  return {
    session,
    loading,
    error,
    toast,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
}