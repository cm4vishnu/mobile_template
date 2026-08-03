import * as React from 'react';
import { ThemeContextValue } from '@/types/theme';
import { FrameworkError } from '@/utils/errors';

/**
 * Theme context for the framework theme system.
 */
const ThemeContext = React.createContext<ThemeContextValue | null>(null);

/**
 * Custom hook to access the theme context.
 * Must be used within a ThemeProvider component.
 * 
 * @returns The theme context value
 * @throws FrameworkError if used outside of ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  
  if (context === null) {
    throw new FrameworkError(
      'useTheme must be used within a ThemeProvider',
      { hook: 'useTheme', context: 'ThemeProvider' }
    );
  }
  
  return context;
}

export { ThemeContext };