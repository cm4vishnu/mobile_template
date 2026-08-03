import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { FrameworkError } from "@/utils/errors";

/**
 * AuthContext provides authentication state and methods to the React component tree.
 * It wraps the useAuth hook and ensures authentication logic is centralized.
 */
const AuthContext = React.createContext<ReturnType<typeof useAuth> | null>(null);

/**
 * AuthProvider component that wraps the application with authentication context.
 * It provides authentication state and methods to all child components.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}