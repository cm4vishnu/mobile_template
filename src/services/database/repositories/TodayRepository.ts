import { SQLiteService } from '@/services/database/sqlite';
import { FrameworkError } from '@/utils/errors';
import { Session, TaskSlot, Task } from '@/features/today/types';

/**
 * Repository for managing Today feature data persistence.
 * Handles session and task operations using SQLite database.
 */
export class TodayRepository {
  private readonly dbService = SQLiteService.getInstance();
  private readonly todaySessionTable = 'today_sessions';
  private readonly taskSlotTable = 'task_slots';
  private readonly taskTable = 'tasks';

  constructor() {
    // Ensure tables exist when repository is instantiated
    this.init();
  }

  /**
   * Initializes database tables for Today feature.
   */
  private async init(): Promise<void> {
    await this.createTables();
  }

  /**
   * Creates necessary tables if they don't exist.
   */
  private async createTables(): Promise<void> {
    // Create today_sessions table
    const sql1 = `
      CREATE TABLE IF NOT EXISTS ${this.todaySessionTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL
      );
    `;
    await this.dbService.execute(sql1);

    // Create task_slots table
    const sql2 = `
      CREATE TABLE IF NOT EXISTS ${this.taskSlotTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        slot_type TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (session_id) REFERENCES ${this.todaySessionTable}(id)
      );
    `;
    await this.dbService.execute(sql2);

    // Create tasks table
    const sql3 = `
      CREATE TABLE IF NOT EXISTS ${this.taskTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slot_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (slot_id) REFERENCES ${this.taskSlotTable}(id)
      );
    `;
    await this.dbService.execute(sql3);
  }

  /**
   * Gets today's session, creating it if it doesn't exist.
   */
  async getTodaySession(): Promise<Session | null> {
    const today = this.getTodayDate();
    const session = await this.getSessionByDate(today);
    if (session) {
      return session;
    }
    // Session doesn't exist, create it
    const sessionId = await this.createSession(today);
    return this.getSessionById(sessionId);
  }

  /**
   * Gets a session by its date.
   */
  private async getSessionByDate(date: string): Promise<Session | null> {
    const result = await this.dbService.query<{ id: number; date: string }>(
      `SELECT id, date FROM ${this.todaySessionTable} WHERE date = ?`,
      [date]
    );
    if (result.length > 0) {
      const id = result[0].id;
      return this.getSessionById(id);
    }
    return null;
  }

  /**
   * Gets a session by its ID.
   */
  private async getSessionById(id: number): Promise<Session | null> {
    const result = await this.dbService.query<{ id: number; date: string }>(
      `SELECT id, date FROM ${this.todaySessionTable} WHERE id = ?`,
      [id]
    );
    if (result.length > 0) {
      const { id, date } = result[0];
      const slots = await this.getTasksForSession(id);
      return { id, date, slots };
    }
    return null;
  }

  /**
   * Creates a new session for the given date.
   */
  private async createSession(date: string): Promise<number> {
    const sql = `INSERT INTO ${this.todaySessionTable} (date) VALUES (?)`;
    const result = await this.dbService.execute(sql, [date]);
    return result.lastID;
  }

  /**
   * Gets all tasks for a session, organized by slots.
   */
  async getTasksForSession(sessionId: number): Promise<TaskSlot[]> {
    // Get all task slots for this session
    const slots = await this.getTaskSlots(sessionId);
    
    // Get all tasks and group them by slot_id
    const tasksResult = await this.dbService.query<{
      id: number;
      slot_id: number;
      title: string;
      completed: number;
      order_index: number;
    }>(`
      SELECT id, slot_id, title, completed, order_index 
      FROM ${this.taskTable} 
      WHERE slot_id IN (SELECT id FROM ${this.taskSlotTable} WHERE session_id = ?) 
      ORDER BY order_index
    `, [sessionId]);

    // Map tasks by slot_id
    const tasksBySlot = new Map<number, Task[]>();
    for (const taskRow of tasksResult) {
      const task: Task = {
        id: taskRow.id.toString(),
        title: taskRow.title,
        completed: taskRow.completed === 1,
        slotId: taskRow.slot_id,
        orderIndex: taskRow.order_index,
      };
      const slotId = taskRow.slot_id;
      if (!tasksBySlot.has(slotId)) {
        tasksBySlot.set(slotId, []);
      }
      tasksBySlot.get(slotId)!.push(task);
    }

    // Build TaskSlot objects with their tasks
    const slots: TaskSlot[] = [];
    for (const slotRow of slots) {
      const tasks: Task[] = [];
      const slotTasks = tasksBySlot.get(slotRow.id) || [];
      for (const task of tasks) {
        tasks.push(task);
      }
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
   * Gets all task slots for a session, ordered by order_index.
   */
  private async getTaskSlots(sessionId: number): Promise<TaskSlot[]> {
    const result = await this.dbService.query<{
      id: number;
      slot_type: string;
      order_index: number;
    }>(`
      SELECT id, slot_type, order_index 
      FROM ${this.taskSlotTable} 
      WHERE session_id = ? 
      ORDER BY order_index
    `, [sessionId]);
    
    return result.map(row => ({
      id: row.id,
      slotType: row.slot_type,
      orderIndex: row.order_index,
      tasks: [] as Task[],
    }));
  }

  /**
   * Adds a new task to a specific slot.
   */
  async addTask(title: string, slotType: string, orderIndex: number): Promise<string> {
    // Get today's session
    const session = await this.getTodaySession();
    if (!session) {
      throw new FrameworkError('No session found for today');
    }

    // Get or create the slot
    const slotId = await this.getOrCreateSlot(session.id, slotType, orderIndex);
    
    // Insert task
    const sql = `
      INSERT INTO ${this.taskTable} (slot_id, title, completed, order_index)
      VALUES (?, ?, 0, ?)
    `;
    const result = await this.dbService.execute(sql, [slotId, title, orderIndex]);
    return result.lastID.toString();
  }

  /**
   * Gets or creates a task slot for a session.
   */
  private async getOrCreateSlot(sessionId: number, slotType: string, orderIndex: number): Promise<number> {
    // Check if slot already exists
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
   * Updates a task with new values (title, completed status, or order index).
   */
  async updateTask(taskId: string, updates: {
    title?: string;
    completed?: boolean;
    orderIndex?: number;
  }): Promise<void> {
    const session = await this.getTodaySession();
    if (!session) {
      throw new FrameworkError('No session found');
    }

    // Find the task's slot_id
    const taskSlot = session.slots.find(s => s.id === this.getTaskSlotId(taskId));
    if (!taskSlot) {
      throw new FrameworkError('Task slot not found');
    }

    // Build SQL query with COALESCE to handle optional updates
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
    values.push(taskId);

    await this.dbService.execute(sql, values);
  }

  /**
   * Deletes a task by its ID.
   */
  async deleteTask(taskId: string): Promise<void> {
    await this.dbService.execute(
      `DELETE FROM ${this.taskTable} WHERE id = ?`,
      [taskId]
    );
  }

  /**
   * Toggles the completion status of a task.
   */
  async toggleTaskCompletion(taskId: string): Promise<void> {
    const session = await this.getTodaySession();
    if (!session) {
      throw new FrameworkError('No session found');
    }

    const task = session.slots.flatMap(slot => 
      slot.tasks.find(t => t.id === taskId)
    ) as Task | undefined;

    if (!task) {
      throw new FrameworkError('Task not found');
    }

    // Toggle completed status
    await this.updateTask(taskId, { completed: !task.completed });
  }

  /**
   * Helper to get task slot ID from task ID.
   */
  private getTaskSlotId(taskId: string): number {
    // In a real implementation, this would query the database
    // For simplicity, we assume taskId maps to a slot_id
    // This is a placeholder - in practice, we'd need to join tables
    // Since we're using temporary state for now, we'll simulate
    // This is a limitation of the current approach
    throw new Error('Task slot ID mapping not implemented');
  }

  /**
   * Helper to get today's date in YYYY-MM-DD format.
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