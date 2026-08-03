import { MigrationRunner } from './MigrationRunner';
import { Migration } from './migrations';
import { FrameworkError } from '@/utils/errors';

/**
 * Represents a single migration step.
 */
export interface Migration {
  version: number;
  sql: string;
}

/**
 * MigrationRunner manages the execution of database schema migrations.
 * It ensures that migrations are executed in order and only once.
 */
export class MigrationRunner {
  private readonly dbService = SQLiteService.getInstance();
  private readonly migrationsTable = 'framework_migrations';

  /**
   * Runs the provided migrations.
   * @param migrations - An array of migrations to apply.
   */
  public async run(migrations: Migration[]): Promise<void> {
    await this.dbService.open();
    await this.ensureMigrationTable();

    const currentVersion = await this.getCurrentVersion();

    for (const migration of migrations) {
      if (migration.version > currentVersion) {
        await this.applyMigration(migration);
      }
    }
  }

  /**
   * Ensures the framework_migrations table exists.
   */
  private async ensureMigrationTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS ${this.migrationsTable} (
        version INTEGER PRIMARY KEY,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await this.dbService.execute(sql);
  }

  /**
   * Gets the current database version from the migrations table.
   */
  private async getCurrentVersion(): Promise<number> {
    const result = await this.dbService.query<{ version: number }>(
      `SELECT MAX(version) as version FROM ${this.migrationsTable}`
    );
    return result[0]?.version || 0;
  }

  /**
   * Applies a single migration within a transaction.
   */
  private async applyMigration(migration: Migration): Promise<void> {
    await this.dbService.beginTransaction();
    try {
      await this.dbService.execute(migration.sql);
      await this.dbService.execute(
        `INSERT INTO ${this.migrationsTable} (version) VALUES (?)`,
        [migration.version]
      );
      await this.dbService.commitTransaction();
    } catch (error) {
      await this.dbService.rollbackTransaction();
      throw new FrameworkError(`Migration to version ${migration.version} failed`, {
        version: migration.version,
        sql: migration.sql,
        cause: error,
      });
    }
  }
}