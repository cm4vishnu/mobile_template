import { SQLiteService } from '@/services/database/sqlite';
import { BaseRepository } from '@/services/database/repositories/BaseRepository';
import { FrameworkError } from '@/utils/errors';
import { Session, TaskSlot, Task } from '@/features/today/types';

/**
 * Repository for Today feature data persistence.
 * Uses SQLiteService for all database operations.
 * Implements repository pattern with strict TypeScript.
 */
export class TodayRepository extends BaseRepository<Session, number> {
  private readonly dbService = SQLiteService.getInstance();
  private readonly todaySessionTable = 'today_sessions';
  private readonly taskSlotTable = 'task_slots';
  private readonly taskTable = 'tasks';

  constructor() {
    super();
    this.ensureTablesExist();
  }

  /**
   * Ensures all required tables exist.
   */
  private async ensureTablesExist(): Promise<void> {
    // Create today_sessions table
    const sessionTableSql = `
      CREATE TABLE IF NOT EXISTS ${this.todaySessionTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE
      );
    `;
    await this.dbService.execute(sessionTableSql);

    // Create task_slots table
    const slotTableSql = `
      CREATE TABLE IF NOT EXISTS ${this.taskSlotTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        slot_type TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (session_id) REFERENCES ${this.todaySessionTable}(id)
      );
    `;
    await this.dbService.execute(slotTableSql);

    // Create tasks table
    const taskTableSql = `
      CREATE TABLE IF NOT EXISTS ${this.taskTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slot_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (slot_id) REFERENCES ${this.taskSlotTable}(id)
      );
    `;
    await this.dbService.execute(taskTableSql);
  }

  /**
   * Creates a new session for the given date.
   * @param date - Date string in YYYY-MM-DD format
   * @returns The newly created session ID
   */
  public async createSession(date: string): Promise<number> {
    try {
      const sql = `INSERT INTO ${this.todaySessionTable} (date) VALUES (?)`;
      const result = await this.dbService.execute(sql, [date]);
      return result.lastID;
    } catch (error) {
      throw new FrameworkError('Failed to create session', { date, cause: error });
    }
  }

  /**
   * Gets today's session, creating it if it doesn't exist.
   * @returns The session with its tasks, or null if no session exists
   */
  public async getTodaySession(): Promise<Session | null> {
    const today = this.getTodayDate();
    const session = await this.findByDate(today);
    if (session) {
      const tasks = await this.getTasksForSession(session.id);
      return { ...session, slots: tasks };
    }
    return null;
  }

  /**
   * Finds a session by its date.
   * @param date - Date string in YYYY-MM-DD format
   * @returns Session object or null if not found
   */
  private async findByDate(date: string): Promise<Session | null> {
    const result = await this.dbService.query<{ id: number; date: string }>(
      `SELECT id, date FROM ${this.todaySessionTable} WHERE date = ?`,
      [date]
    );
    if (result.length === 0) {
      return null;
    }
    const { id, date: sessionDate } = result[0];
    const slots = await this.getTasksForSession(id);
    return { id: sessionDate, slots };
  }

  /**
   * Gets all tasks for a session, organized by slots.
   * @param sessionId - The session ID
   * @returns Array of TaskSlot objects
   */
  public async getTasksForSession(sessionId: number): Promise<TaskSlot[]> {
    // Get all task slots for this session, ordered by order_index
    const slotRows = await this.dbService.query<{
      id: number;
      slot_type: string;
      order_index: number;
    }>(`
      SELECT id, slot_type, order_index 
      FROM ${this.taskSlotTable} 
      WHERE session_id = ? 
      ORDER BY order_index
    `, [sessionId]);

    // Map slots to TaskSlot objects
    const slots: TaskSlot[] = [];
    for (const slotRow of slotRows) {
      const slotId = slotRow.id;
      const tasks = await this.getTasksBySlotId(slotId);
      const slot: TaskSlot = {
        id: slotRow.id,
        slotType: slotRow.slot_type,
        orderIndex: slotRow.order_index,
        tasks: tasks,
      };
      slots.push(slot);
    }

    return slots;
  }

  /**
   * Gets all tasks for a specific slot ID.
   * @param slotId - The slot ID
   * @returns Array of Task objects
   */
  private async getTasksBySlotId(slotId: number): Promise<Task[]> {
    const taskRows = await this.dbService.query<{
      id: number;
      slot_id: number;
      title: string;
      completed: number;
      order_index: number;
    }>(`
      SELECT id, slot_id, title, completed, order_index 
      FROM ${this.taskTable} 
      WHERE slot_id = ? 
      ORDER BY order_index
    `, [slotId]);

    return taskRows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      completed: row.completed === 1,
      slotId: row.slot_id,
      orderIndex: row.order_index,
    }));
  }

  /**
   * Creates a new task in a specific slot.
   * @param sessionId - The session ID
   * @param title - Task title
   * @param slotType - Slot type (e.g., 'morning')
   * @param orderIndex - Position in slot
   * @returns The newly created task ID
   */
  public async createTask(
    sessionId: number,
    title: string,
    slotType: string,
    orderIndex: number
  ): Promise<string> {
    // First ensure slot exists or create it
    const slotId = await this.ensureSlotExists(sessionId, slotType, orderIndex);
    
    // Insert task
    const sql = `
      INSERT INTO ${this.taskTable} (slot_id, title, completed, order_index)
      VALUES (?, ?, 0, ?)
    `;
    const result = await this.dbService.execute(sql, [slotId, title, orderIndex]);
    return result.lastID.toString();
  }

  /**
   * Ensures a slot exists for a session, creating it if necessary.
   * @param sessionId - The session ID
   * @param slotType - Slot type
   * @param orderIndex - Position in slot
   * @returns The slot ID
   */
  private async ensureSlotExists(
    sessionId: number,
    slotType: string,
    orderIndex: number
  ): Promise<number> {
    const existing = await this.dbService.query<{ id: number }>(
      `SELECT id FROM ${this.taskSlotTable} 
       WHERE session_id = ? AND slot_type = ? AND order_index = ?`,
      [sessionId, slotType, orderIndex]
    );

    if (existing.length > 0) {
      return existing[0].id;
    }

    // Create new slot
    const sql = `
      INSERT INTO ${this.taskSlotTable} (session_id, slot_type, order_index)
      VALUES (?, ?, ?)
    `;
    const result = await this.dbService.execute(sql, [sessionId, slotType, orderIndex]);
    return result.lastID;
  }

  /**
   * Updates a task with new values.
   * @param taskId - The task ID
   * @param updates - Partial updates to apply
   */
  public async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    // Convert taskId to number for SQL query
    const numericId = parseInt(taskId, 10);
    if (isNaN(numericId)) {
      throw new FrameworkError('Invalid task ID', { taskId });
    }

    const sql = `
      UPDATE ${this.taskTable}
      SET 
        title = COALESCE(?, title),
        completed = COALESCE(?, completed),
        order_index = COALESCE(?, order_index)
      WHERE id = ?
    `;
    const values: any[] = [];
    if (updates.title !== undefined) values.push(updates.title);
    if (updates.completed !== undefined) values.push(updates.completed ? 1 : 0);
    if (updates.orderIndex !== undefined) values.push(updates.orderIndex);
    values.push(numericId);

    try {
      await this.dbService.execute(sql, values);
    } catch (error) {
      throw new FrameworkError('Failed to update task', { taskId, cause: error });
    }
  }

  /**
   * Deletes a task by its ID.
   * @param taskId - The task ID
   */
  public async deleteTask(taskId: string): Promise<void> {
    const numericId = parseInt(taskId, 10);
    if (isNaN(numericId)) {
      throw new FrameworkError('Invalid task ID', { taskId });
    }
    await this.dbService.execute(
      `DELETE FROM ${this.taskTable} WHERE id = ?`,
      [numericId]
    );
  }

  /**
   * Toggles the completion status of a task.
   * @param taskId - The task ID
   */
  public async toggleTaskCompletion(taskId: string): Promise<void> {
    // Get current task to determine current state
    const currentTask = await this.getTaskById(taskId);
    if (!currentTask) {
      throw new FrameworkError('Task not found', { taskId });
    }

    // Toggle completion
    await this.updateTask(taskId, { completed: !currentTask.completed });
  }

  /**
   * Gets a task by its ID.
   * @param taskId - The task ID
   * @returns The Task object or null if not found
   */
  private async getTaskById(taskId: string): Promise<Task | null> {
    const numericId = parseInt(taskId, 10);
    if (isNaN(numericId)) {
      return null;
    }
    const rows = await this.dbService.query<{
      id: number;
      slot_id: number;
      title: string;
      completed: number;
      order_index: number;
    }>(`
      SELECT id, slot_id, title, completed, order_index 
      FROM ${this.taskTable} 
      WHERE id = ?
    `, [numericId]);
    if (rows.length === 0) {
      return null;
    }
    const row = rows[0];
    return {
      id: row.id.toString(),
      title: row.title,
      completed: row.completed === 1,
      slotId: row.slot_id,
      orderIndex: row.order_index,
    };
  }

  /**
   * Gets today's date in YYYY-MM-DD format.
   */
  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

// Export singleton instance
export const todayRepository = new TodayRepository();