import { SQLiteService } from '../sqlite';
import { FrameworkError } from '@/utils/errors';

/**
 * BaseRepository provides generic CRUD operations for any entity type.
 * All domain-specific repositories must extend this class.
 * 
 * @template T - The entity type.
 * @template K - The type of the primary key.
 */
export abstract class BaseRepository<T extends Record<string, unknown>, K = string | number> {
  protected readonly db = SQLiteService.getInstance();
  protected abstract readonly tableName: string;
  protected abstract readonly primaryKey: keyof T;

  /**
   * Finds all records in the table.
   */
  public async findAll(): Promise<T[]> {
    return this.db.query<T>(`SELECT * FROM ${this.tableName}`);
  }

  /**
   * Finds a single record by its primary key.
   * @param id - The primary key value.
   */
  public async findById(id: K): Promise<T | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} =?`;
    const results = await this.db.query<T>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Inserts a new record into the table.
   * @param entity - The entity to insert.
   */
  public async insert(entity: T): Promise<void> {
    const keys = Object.keys(entity);
    const values = Object.values(entity);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;

    try {
      await this.db.execute(sql, values);
    } catch (error) {
      throw new FrameworkError(`Failed to insert into ${this.tableName}`, { entity, cause: error });
    }
  }

  /**
   * Updates an existing record.
   * @param id - The primary key value.
   * @param updates - The fields to update.
   */
  public async update(id: K, updates: Partial<T>): Promise<void> {
    const keys = Object.keys(updates);
    if (keys.length === 0) return;

    const setClause = keys.map((key) => `${key} =?`).join(', ');
    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.primaryKey} =?`;
    const values = [...Object.values(updates), id];

    try {
      await this.db.execute(sql, values);
    } catch (error) {
      throw new FrameworkError(`Failed to update ${this.tableName}`, { id, updates, cause: error });
    }
  }

  /**
   * Deletes a record by its primary key.
   * @param id - The primary key value.
   */
  public async delete(id: K): Promise<void> {
    const sql = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} =?`;
    try {
      await this.db.execute(sql, [id]);
    } catch (error) {
      throw new FrameworkError(`Failed to delete from ${this.tableName}`, { id, cause: error });
    }
  }

  /**
   * Checks if a record exists.
   * @param id - The primary key value.
   */
  public async exists(id: K): Promise<boolean> {
    const sql = `SELECT 1 FROM ${this.tableName} WHERE ${this.primaryKey} =? LIMIT 1`;
    const results = await this.db.query<unknown>(sql, [id]);
    return results.length > 0;
  }

  /**
   * Counts the number of records in the table.
   */
  public async count(): Promise<number> {
    const sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const results = await this.db.query<{ count: number }>(sql);
    return results[0]?.count || 0;
  }
}