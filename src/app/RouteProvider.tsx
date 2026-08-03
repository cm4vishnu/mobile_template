import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Providers } from './providers';
import { AppRouter } from './AppRouter';

/**
 * RouteProvider is the root routing component that integrates authentication
 * and theme with the React Router system.
 */
export function RouteProvider({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <Providers>
        <AppRouter>{children}</AppRouter>
      </Providers>
    </BrowserRouter>
  );
}