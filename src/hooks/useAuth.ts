import * as React from "react";
import { FirebaseAuthService } from "@/services/auth";
import { User } from "firebase/auth";
import { FrameworkError } from "@/utils/errors";

/**
 * Custom hook for Firebase Authentication state and methods.
 * Provides reactive authentication state and wraps FirebaseAuthService methods.
 * 
 * @returns Object containing authentication state and methods
 */
export function useAuth() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [initialized, setInitialized] = React.useState<boolean>(false);

  const authService = FirebaseAuthService.getInstance();

  // Initialize Firebase and subscribe to auth state changes
  React.useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Initialize Firebase if not already done
        if (!authService.isInitialized()) {
          authService.initialize();
        }
        if (isMounted) setInitialized(true);
      } catch (error) {
        if (isMounted) {
          setInitialized(false);
          setLoading(false);
        }
        return;
      }

      // Subscribe to auth state changes
      const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
        if (isMounted) {
          setUser(firebaseUser);
          setLoading(false);
        }
      });

      // Cleanup subscription on unmount
      return () => {
        unsubscribe();
        isMounted = false;
      };
    };

    initializeAuth();
  }, [authService]);

  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      const firebaseUser = await authService.signInWithEmail(email, password);
      setUser(firebaseUser);
      return firebaseUser;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string): Promise<User> => {
    try {
      const firebaseUser = await authService.createUserWithEmail(email, password);
      setUser(firebaseUser);
      return firebaseUser;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const initialize = async (): Promise<void> => {
    try {
      authService.initialize();
      setInitialized(true);
    } catch (error) {
      setInitialized(false);
      throw error;
    }
  };

  return {
    user,
    loading,
    initialized,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    initialize,
  };
}