/**
 * Theme mode types supported by the framework.
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Resolved theme after system detection.
 */
export type ResolvedTheme = 'light' | 'dark';

/**
 * Theme configuration interface.
 */
export interface ThemeConfig {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
}

/**
 * Theme context value interface.
 */
export interface ThemeContextValue {
  theme: ThemeConfig;
  setTheme: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  resolvedTheme: ResolvedTheme;
}