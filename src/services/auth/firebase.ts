import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  NextOrObserver,
} from 'firebase/auth';
import { FrameworkError } from '@/utils/errors';

/**
 * FirebaseAuthService provides a singleton wrapper around Firebase Authentication.
 * It handles user authentication state and provides methods for common auth operations.
 */
export class FirebaseAuthService {
  private static instance: FirebaseAuthService;
  private auth: ReturnType<typeof getAuth>;
  private initialized = false;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Returns the singleton instance of FirebaseAuthService.
   */
  public static getInstance(): FirebaseAuthService {
    if (!FirebaseAuthService.instance) {
      FirebaseAuthService.instance = new FirebaseAuthService();
    }
    return FirebaseAuthService.instance;
  }

  /**
   * Initializes Firebase Authentication with configuration from environment variables.
   * Must be called before using any other methods.
   */
  public initialize(): void {
    if (this.initialized) return;

    try {
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
      };

      // Validate required configuration
      const requiredKeys = [
        'apiKey',
        'authDomain',
        'projectId',
        'storageBucket',
        'messagingSenderId',
        'appId',
      ] as const;
      for (const key of requiredKeys) {
        if (!firebaseConfig[key as keyof typeof firebaseConfig]) {
          throw new Error(`Missing Firebase configuration: ${key}`);
        }
      }

      initializeApp(firebaseConfig);
      this.auth = getAuth();
      this.initialized = true;
    } catch (error) {
      throw new FrameworkError('Failed to initialize Firebase Authentication', {
        cause: error,
      });
    }
  }

  /**
   * Signs in a user with email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns The authenticated user.
   */
  public async signInWithEmail(email: string, password: string): Promise<User> {
    this.ensureInitialized();
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw new FrameworkError('Failed to sign in with email', {
        email,
        cause: error,
      });
    }
  }

  /**
   * Creates a new user with email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns The created user.
   */
  public async createUserWithEmail(
    email: string,
    password: string
  ): Promise<User> {
    this.ensureInitialized();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw new FrameworkError('Failed to create user with email', {
        email,
        cause: error,
      });
    }
  }

  /**
   * Signs out the current user.
   */
  public async signOut(): Promise<void> {
    this.ensureInitialized();
    try {
      await signOut(this.auth);
    } catch (error) {
      throw new FrameworkError('Failed to sign out', { cause: error });
    }
  }

  /**
   * Gets the currently authenticated user.
   * @returns The current user or null if not signed in.
   */
  public getCurrentUser(): User | null {
    this.ensureInitialized();
    return this.auth.currentUser;
  }

  /**
   * Checks if a user is currently authenticated.
   * @returns True if a user is signed in, false otherwise.
   */
  public isAuthenticated(): boolean {
    this.ensureInitialized();
    return !!this.auth.currentUser;
  }

  /**
   * Listens for changes in the user's sign-in state.
   * @param callback - A function that will be called when the auth state changes.
   * @returns An unsubscribe function.
   */
  public onAuthStateChanged(
    callback: NextOrObserver<User>
  ): () => void {
    this.ensureInitialized();
    return onAuthStateChanged(this.auth, callback);
  }

  /**
   * Ensures Firebase is initialized before proceeding.
   * @throws FrameworkError if not initialized.
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new FrameworkError(
        'Firebase Authentication not initialized. Call initialize() first.'
      );
    }
  }
}