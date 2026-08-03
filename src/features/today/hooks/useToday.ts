import { useState, useEffect, useCallback } from 'react';
import { todayRepository } from '@/features/today/TodayRepository';
import { Session, TaskSlot, Task } from '@/features/today/types';
import { FrameworkError } from '@/utils/errors';

/**
 * Custom hook for Today feature state and operations.
 * Uses TodayRepository as the single source of truth for persistence.
 */
export function useToday() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Loads today's session from the repository.
   */
  const loadSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todayRepository.getTodaySession();
      setSession(data);
    } catch (err) {
      setError(err instanceof Error ? err : new FrameworkError('Failed to load session', { cause: err }));
    } finally {
      setLoading(false);
    }
  }, []);

  // Load session on mount
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  /**
   * Adds a new task to a specific slot.
   */
  const addTask = useCallback(async (
    title: string,
    slotType: string,
    orderIndex: number
  ): Promise<string> => {
    if (!session) {
      throw new FrameworkError('No session available');
    }
    const taskId = await todayRepository.createTask(session.id, title, slotType, orderIndex);
    await loadSession(); // Refresh session
    return taskId;
  }, [session, loadSession]);

  /**
   * Updates a task with new values.
   */
  const updateTask = useCallback(async (
    taskId: string,
    updates: Partial<Task>
  ): Promise<void> => {
    await todayRepository.updateTask(taskId, updates);
    await loadSession(); // Refresh session
  }, [loadSession]);

  /**
   * Deletes a task by its ID.
   */
  const deleteTask = useCallback(async (taskId: string): Promise<void> => {
    await todayRepository.deleteTask(taskId);
    await loadSession(); // Refresh session
  }, [loadSession]);

  /**
   * Toggles the completion status of a task.
   */
  const toggleTaskCompletion = useCallback(async (taskId: string): Promise<void> => {
    await todayRepository.toggleTaskCompletion(taskId);
    await loadSession(); // Refresh session
  }, [loadSession]);

  return {
    session,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refresh: loadSession,
  };
}