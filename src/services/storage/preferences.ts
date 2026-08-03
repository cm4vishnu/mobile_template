import { Preferences } from '@capacitor/preferences';
import { FrameworkError } from '@/utils/errors';

/**
 * Framework storage keys for generic preferences.
 * These keys are shared across all applications built on this framework.
 */
export const FRAMEWORK_STORAGE_KEYS = {
  THEME: 'theme',
  LANGUAGE: 'language',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  AUTH_TOKEN: 'auth_token',
} as const;

/**
 * Type definition for all framework storage keys.
 */
export type FrameworkStorageKey = typeof FRAMEWORK_STORAGE_KEYS[keyof typeof FRAMEWORK_STORAGE_KEYS];

/**
 * PreferencesService provides a type-safe wrapper around Capacitor Preferences plugin.
 * This service is the single entry point for all key-value storage used by future applications.
 * It handles JSON serialization/deserialization automatically and provides consistent error handling.
 */
export class PreferencesService {
  /**
   * Get a value from storage with type safety.
   * @param key - The storage key
   * @returns The stored value or null if not found
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const { value } = await Preferences.get({ key });
      if (value === null || value === undefined) {
        return null;
      }
      
      // Handle JSON values
      if (typeof value === 'string') {
        try {
          return JSON.parse(value) as T;
        } catch {
          // If not valid JSON, return as-is (primitive values)
          return value as unknown as T;
        }
      }
      
      return value as T;
    } catch (error) {
      throw new FrameworkError(
        `Failed to get value for key "${key}"`,
        { key, cause: error }
      );
    }
  }

  /**
   * Set a value in storage with automatic JSON serialization.
   * @param key - The storage key
   * @param value - The value to store
   */
  static async set<T>(key: string, value: T): Promise<void> {
    try {
      // Serialize objects to JSON
      const serializedValue = typeof value === 'object' && value !== null
        ? JSON.stringify(value)
        : value;
      
      await Preferences.set({ key, value: serializedValue });
    } catch (error) {
      throw new FrameworkError(
        `Failed to set value for key "${key}"`,
        { key, value, cause: error }
      );
    }
  }

  /**
   * Remove a value from storage.
   * @param key - The storage key
   */
  static async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      throw new FrameworkError(
        `Failed to remove value for key "${key}"`,
        { key, cause: error }
      );
    }
  }

  /**
   * Clear all values from storage.
   */
  static async clear(): Promise<void> {
    try {
      await Preferences.clear();
    } catch (error) {
      throw new FrameworkError(
        'Failed to clear preferences storage',
        { cause: error }
      );
    }
  }

  /**
   * Check if a key exists in storage.
   * @param key - The storage key
   * @returns True if the key exists, false otherwise
   */
  static async has(key: string): Promise<boolean> {
    try {
      const { value } = await Preferences.get({ key });
      return value !== null && value !== undefined;
    } catch (error) {
      throw new FrameworkError(
        `Failed to check existence of key "${key}"`,
        { key, cause: error }
      );
    }
  }

  /**
   * Get a framework-specific storage key.
   * @param keyType - The type of framework key
   * @returns The storage key
   */
  static getFrameworkKey(keyType: keyof typeof FRAMEWORK_STORAGE_KEYS): string {
    return FRAMEWORK_STORAGE_KEYS[keyType];
  }
}