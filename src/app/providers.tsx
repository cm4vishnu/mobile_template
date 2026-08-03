import * as React from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from './AuthProvider';

/**
 * Providers component that composes all framework providers.
 * This is the single provider wrapper for the entire application.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}