import * as React from 'react';
import { ThemeContextValue } from '@/types/theme';
import { ThemeMode, ResolvedTheme } from '@/types/theme';
import { PreferencesService } from '@/services/storage';
import { DEFAULT_THEME_MODE, THEME_CLASSES, SYSTEM_DARK_MEDIA_QUERY } from '@/constants/theme';
import { FrameworkError } from '@/utils/errors';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

/**
 * ThemeProvider component that manages theme state and persistence.
 * Integrates with PreferencesService for persistent theme selection.
 * Supports light, dark, and system themes with automatic system detection.
 */
export function ThemeProvider({
  children,
  defaultMode = DEFAULT_THEME_MODE,
  storageKey = 'theme',
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<ThemeMode>(defaultMode);
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>('light');
  const [mounted, setMounted] = React.useState(false);
  const [initialized, setInitialized] = React.useState(false);

  // Initialize theme from storage and system preference
  React.useEffect(() => {
    let isMounted = true;

    const initializeTheme = async () => {
      try {
        // Load saved theme from preferences
        const savedTheme = await PreferencesService.get<ThemeMode>(storageKey);
        
        if (isMounted) {
          const initialTheme = savedTheme || defaultMode;
          setThemeState(initialTheme);
          
          // Resolve initial theme
          const resolved = await resolveTheme(initialTheme);
          setResolvedTheme(resolved);
          
          // Apply theme to document
          applyTheme(resolved, disableTransitionOnChange);
          
          setInitialized(true);
          setMounted(true);
        }
      } catch (error) {
        if (isMounted) {
          // Fallback to default theme on error
          const resolved = await resolveTheme(defaultMode);
          setResolvedTheme(resolved);
          applyTheme(resolved, disableTransitionOnChange);
          setInitialized(true);
          setMounted(true);
        }
      }
    };

    initializeTheme();

    return () => {
      isMounted = false;
    };
  }, [storageKey, defaultMode, disableTransitionOnChange]);

  // Listen for system theme changes
  React.useEffect(() => {
    if (!enableSystem || !mounted) return;

    const mediaQuery = window.matchMedia(SYSTEM_DARK_MEDIA_QUERY);
    
    const handleChange = async () => {
      if (theme === 'system') {
        const resolved = await resolveTheme('system');
        setResolvedTheme(resolved);
        applyTheme(resolved, disableTransitionOnChange);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme, enableSystem, mounted, disableTransitionOnChange]);

  // Resolve theme mode to actual theme
  const resolveTheme = async (mode: ThemeMode): Promise<ResolvedTheme> => {
    if (mode === 'system' && enableSystem) {
      return window.matchMedia(SYSTEM_DARK_MEDIA_QUERY).matches ? 'dark' : 'light';
    }
    return mode;
  };

  // Apply theme to document
  const applyTheme = (resolved: ResolvedTheme, disableTransition: boolean) => {
    const root = document.documentElement;
    
    if (disableTransition) {
      root.style.transition = 'none';
    }
    
    // Remove both theme classes
    root.classList.remove(THEME_CLASSES.light, THEME_CLASSES.dark);
    
    // Add resolved theme class
    root.classList.add(THEME_CLASSES[resolved]);
    
    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', resolved);
    
    // Re-enable transitions after a frame
    if (disableTransition) {
      requestAnimationFrame(() => {
        root.style.transition = '';
      });
    }
  };

  // Set theme mode
  const setTheme = async (mode: ThemeMode): Promise<void> => {
    try {
      await PreferencesService.set(storageKey, mode);
      setThemeState(mode);
      
      const resolved = await resolveTheme(mode);
      setResolvedTheme(resolved);
      applyTheme(resolved, disableTransitionOnChange);
    } catch (error) {
      throw new FrameworkError('Failed to set theme', { mode, cause: error });
    }
  };

  // Toggle between light and dark (skips system)
  const toggleTheme = async (): Promise<void> => {
    const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    await setTheme(newMode);
  };

  // Don't render children until mounted to prevent flash
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{
        theme: { mode: defaultMode, resolvedTheme: 'light' },
        setTheme: async () => {},
        toggleTheme: async () => {},
        resolvedTheme: 'light',
      }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  const contextValue: ThemeContextValue = {
    theme: { mode: theme, resolvedTheme },
    setTheme,
    toggleTheme,
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}