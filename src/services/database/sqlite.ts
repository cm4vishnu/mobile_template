import { Capacitor } from '@capacitor/core';
import { SQLite, SQLiteConnection, SQLiteDatabase } from '@capacitor-community/sqlite';
import { FrameworkError } from '@/utils/errors';

/**
 * Database connection state.
 */
export type DatabaseState = 'uninitialized' | 'connecting' | 'connected' | 'closed';

/**
 * SQLiteService provides a singleton instance for managing the SQLite connection.
 * It acts as the low-level driver for the database layer.
 */
export class SQLiteService {
  private static instance: SQLiteService;
  private connection: SQLiteConnection;
  private db: SQLiteDatabase | null = null;
  private state: DatabaseState = 'uninitialized';
  private readonly dbName = 'framework_db';

  private constructor() {
    this.connection = new SQLiteConnection(Capacitor.getPlugin('CapacitorSQLite'));
  }

  /**
   * Returns the singleton instance of the SQLiteService.
   */
  public static getInstance(): SQLiteService {
    if (!SQLiteService.instance) {
      SQLiteService.instance = new SQLiteService();
    }
    return SQLiteService.instance;
  }

  /**
   * Initializes and opens the database connection.
   */
  public async open(): Promise<void> {
    if (this.state === 'connected') return;
    if (this.state === 'connecting') {
      throw new FrameworkError('Database is already connecting');
    }

    this.state = 'connecting';

    try {
      this.db = await this.connection.createConnection(this.dbName, false, 'ode', 1, false);
      await this.db.open();
      this.state = 'connected';
    } catch (error) {
      this.state = 'uninitialized';
      throw new FrameworkError('Failed to open database connection', { cause: error });
    }
  }

  /**
   * Closes the database connection.
   */
  public async close(): Promise<void> {
    if (this.state !== 'connected' || !this.db) return;

    try {
      await this.db.close();
      this.db = null;
      this.state = 'closed';
    } catch (error) {
      throw new FrameworkError('Failed to close database connection', { cause: error });
    }
  }

  /**
   * Executes a single SQL statement.
   * @param sql - The SQL statement to execute.
   * @param params - Parameters for the statement.
   */
  public async execute(sql: string, params: readonly unknown[] = []): Promise<unknown> {
    this.ensureConnected();
    try {
      return await this.db!.executeSet(sql, params);
    } catch (error) {
      throw new FrameworkError(`Execution failed: ${sql}`, { sql, params, cause: error });
    }
  }

  /**
   * Executes a query and returns the result set.
   * @param sql - The SQL query.
   * @param params - Parameters for the query.
   */
  public async query<T>(sql: string, params: readonly unknown[] = []): Promise<T[]> {
    this.ensureConnected();
    try {
      const result = await this.db!.query(sql, params);
      return result.values as T[];
    } catch (error) {
      throw new FrameworkError(`Query failed: ${sql}`, { sql, params, cause: error });
    }
  }

  /**
   * Executes multiple SQL statements within a single transaction.
   * @param statements - An array of SQL statements.
   * @param params - An array of parameter arrays.
   */
  public async executeSet(statements: string[], params: readonly unknown[] = []): Promise<unknown> {
    this.ensureConnected();
    try {
      return await this.db!.executeSet(statements, params);
    } catch (error) {
      throw new FrameworkError('Transaction execution failed', { statements, params, cause: error });
    }
  }

  /**
   * Starts a transaction.
   */
  public async beginTransaction(): Promise<void> {
    this.ensureConnected();
    await this.db!.execute('BEGIN TRANSACTION');
  }

  /**
   * Commits the current transaction.
   */
  public async commitTransaction(): Promise<void> {
    this.ensureConnected();
    await this.db!.execute('COMMIT');
  }

  /**
   * Rolls back the current transaction.
   */
  public async rollbackTransaction(): Promise<void> {
    this.ensureConnected();
    await this.db!.execute('ROLLBACK');
  }

  /**
   * Checks if the database is currently connected.
   */
  public isConnected(): boolean {
    return this.state === 'connected';
  }

  private ensureConnected(): void {
    if (this.state !== 'connected' || !this.db) {
      throw new FrameworkError('Database is not connected. Call open() first.');
    }
  }
}