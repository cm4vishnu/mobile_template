import * as React from "react";
import { useAuth } from "./useAuth";
import { FrameworkError } from "@/utils/errors";

/**
 * Custom hook to access the authentication context.
 * Must be used within an AuthProvider component.
 * 
 * @returns The authentication context value
 * @throws FrameworkError if used outside of AuthProvider
 */
export function useAuthContext() {
  const context = React.useContext(AuthContext);
  
  if (context === null) {
    throw new FrameworkError(
      "useAuthContext must be used within an AuthProvider",
      { hook: "useAuthContext", context: "AuthProvider" }
    );
  }
  
  return context;
}