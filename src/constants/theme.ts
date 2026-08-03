import { ThemeMode, ResolvedTheme } from '@/types/theme';

/**
 * Default theme mode.
 */
export const DEFAULT_THEME_MODE: ThemeMode = 'system';

/**
 * Theme storage key for persistence.
 */
export const THEME_STORAGE_KEY = 'theme';

/**
 * CSS class names for themes.
 */
export const THEME_CLASSES = {
  light: 'light',
  dark: 'dark',
} as const;

/**
 * Media query for system dark mode detection.
 */
export const SYSTEM_DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

/**
 * Theme mode display labels.
 */
export const THEME_MODE_LABELS: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

/**
 * Resolved theme display labels.
 */
export const RESOLVED_THEME_LABELS: Record<ResolvedTheme, string> = {
  light: 'Light',
  dark: 'Dark',
};