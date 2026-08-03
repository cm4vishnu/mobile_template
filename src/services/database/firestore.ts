import { FirebaseApp, initializeApp, getApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentSnapshot,
  QuerySnapshot,
} from 'firebase/firestore';
import { FrameworkError } from '@/utils/errors';

/**
 * FirestoreService provides a singleton wrapper around Firebase Firestore.
 * It handles initialization and provides strongly typed methods for Firestore operations.
 * All Firebase-specific logic is encapsulated within this service.
 */
export class FirestoreService {
  private static instance: FirestoreService;
  private firestore: Firestore | null = null;
  private initialized = false;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Returns the singleton instance of FirestoreService.
   */
  public static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService();
    }
    return FirestoreService.instance;
  }

  /**
   * Initializes Firestore from the existing Firebase app.
   * If Firebase is not initialized, it initializes it using environment variables.
   * Must be called before using any other methods.
   */
  public initialize(): void {
    if (this.initialized) return;

    try {
      // Check if Firebase app is already initialized
      let app: FirebaseApp;
      try {
        app = getApp();
      } catch {
        // Initialize Firebase if not already done
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

        app = initializeApp(firebaseConfig);
      }

      // Initialize Firestore
      this.firestore = getFirestore(app);
      this.initialized = true;
    } catch (error) {
      throw new FrameworkError('Failed to initialize Firestore', { cause: error });
    }
  }

  /**
   * Ensures Firestore is initialized before proceeding.
   * @throws FrameworkError if not initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized || !this.firestore) {
      throw new FrameworkError(
        'Firestore not initialized. Call initialize() first.'
      );
    }
  }

  /**
   * Gets a typed collection reference.
   * @param path - The collection path
   * @returns A collection reference wrapper
   */
  public collection<T = unknown>(path: string): FirestoreCollectionReference<T> {
    this.ensureInitialized();
    return new FirestoreCollectionReference<T>(this.firestore, path);
  }

  /**
   * Gets a typed document reference.
   * @param path - The document path
   * @returns A document reference wrapper
   */
  public document<T = unknown>(path: string): FirestoreDocumentReference<T> {
    this.ensureInitialized();
    return new FirestoreDocumentReference<T>(this.firestore, path);
  }

  /**
   * Gets a single document by path.
   * @param path - The document path
   * @returns The document data or null if not found
   */
  public async getDocument<T = unknown>(
    path: string
  ): Promise<T | null> {
    this.ensureInitialized();
    try {
      const docSnap = await getDoc(doc(this.firestore, path));
      return docSnap.exists() ? (docSnap.data() as T) : null;
    } catch (error) {
      throw new FrameworkError(`Failed to get document: ${path}`, {
        path,
        cause: error,
      });
    }
  }

  /**
   * Gets all documents in a collection.
   * @param path - The collection path
   * @returns An array of document data
   */
  public async getDocuments<T = unknown>(
    path: string
  ): Promise<T[]> {
    this.ensureInitialized();
    try {
      const querySnap = await getDocs(collection(this.firestore, path));
      return querySnap.docs.map(doc => doc.data() as T);
    } catch (error) {
      throw new FrameworkError(`Failed to get documents: ${path}`, {
        path,
        cause: error,
      });
    }
  }

  /**
   * Sets a document at the specified path.
   * @param path - The document path
   * @param data - The data to set
   * @param options - Optional merge options
   */
  public async setDocument<T = unknown>(
    path: string,
    data: T,
    options: { merge?: boolean } = {}
  ): Promise<void> {
    this.ensureInitialized();
    try {
      await setDoc(doc(this.firestore, path), data, {
        merge: !!options.merge,
      });
    } catch (error) {
      throw new FrameworkError(`Failed to set document: ${path}`, {
        path,
        data,
        cause: error,
      });
    }
  }

  /**
   * Adds a document to a collection with an auto-generated ID.
   * @param path - The collection path
   * @param data - The document data
   * @returns The ID of the newly created document
   */
  public async addDocument<T = unknown>(
    path: string,
    data: T
  ): Promise<string> {
    this.ensureInitialized();
    try {
      const docRef = await addDoc(collection(this.firestore, path), data);
      return docRef.id;
    } catch (error) {
      throw new FrameworkError(`Failed to add document to: ${path}`, {
        path,
        data,
        cause: error,
      });
    }
  }

  /**
   * Updates a document with the provided data.
   * @param path - The document path
   * @param data - The data to update (partial)
   */
  public async updateDocument<T = unknown>(
    path: string,
    data: Partial<T>
  ): Promise<void> {
    this.ensureInitialized();
    try {
      await updateDoc(doc(this.firestore, path), data);
    } catch (error) {
      throw new FrameworkError(`Failed to update document: ${path}`, {
        path,
        data,
        cause: error,
      });
    }
  }

  /**
   * Deletes a document at the specified path.
   * @param path - The document path
   */
  public async deleteDocument(path: string): Promise<void> {
    this.ensureInitialized();
    try {
      await deleteDoc(doc(this.firestore, path));
    } catch (error) {
      throw new FrameworkError(`Failed to delete document: ${path}`, {
        path,
        cause: error,
      });
    }
  }
}

/**
 * Wrapper for Firestore CollectionReference with type safety.
 * Not exported - only accessible through FirestoreService methods.
 */
class FirestoreCollectionReference<T> {
  private constructor(
    private firestore: Firestore,
    private path: string
  ) {}

  /**
   * Gets a document reference within this collection.
   * @param id - The document ID
   * @returns A document reference wrapper
   */
  public doc(id: string): FirestoreDocumentReference<T> {
    return new FirestoreDocumentReference<T>(
      this.firestore,
      `${this.path}/${id}`
    );
  }

  /**
   * Adds a document to this collection with an auto-generated ID.
   * @param data - The document data
   * @returns The ID of the newly created document
   */
  public async add(data: T): Promise<string> {
    const docRef = await addDoc(collection(this.firestore, this.path), data);
    return docRef.id;
  }

  /**
   * Gets all documents in this collection.
   * @returns An array of document data
   */
  public async get(): Promise<T[]> {
    const querySnap = await getDocs(collection(this.firestore, this.path));
    return querySnap.docs.map(doc => doc.data() as T);
  }
}

/**
 * Wrapper for Firestore DocumentReference with type safety.
 * Not exported - only accessible through FirestoreService methods.
 */
class FirestoreDocumentReference<T> {
  private constructor(
    private firestore: Firestore,
    private path: string
  ) {}

  /**
   * Gets the document data.
   * @returns The document data or null if not found
   */
  public async get(): Promise<T | null> {
    const docSnap = await getDoc(doc(this.firestore, this.path));
    return docSnap.exists() ? (docSnap.data() as T) : null;
  }

  /**
   * Sets the document data.
   * @param data - The data to set
   * @param options - Optional merge options
   */
  public async set(
    data: T,
    options: { merge?: boolean } = {}
  ): Promise<void> {
    await setDoc(doc(this.firestore, this.path), data, {
      merge: !!options.merge,
    });
  }

  /**
   * Updates the document with the provided data.
   * @param data - The data to update (partial)
   */
  public async update(data: Partial<T>): Promise<void> {
    await updateDoc(doc(this.firestore, this.path), data);
  }

  /**
   * Deletes the document.
   */
  public async delete(): Promise<void> {
    await deleteDoc(doc(this.firestore, this.path));
  }
}