import { FirestoreService } from '@/services/database/firestore';
import { FrameworkError } from '@/utils/errors';

/**
 * Generic Firestore repository for CRUD operations on collections.
 * 
 * @template T - Type of the data model for the collection
 */
export class FirestoreRepository<T> {
  private readonly collectionName: string;
  private readonly firestoreService = FirestoreService.getInstance();

  /**
   * Creates a new Firestore repository instance.
   * @param collectionName - The name of the Firestore collection to operate on
   */
  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  /**
   * Gets a document by ID.
   * @param id - The document ID
   * @returns Promise containing the document data or null if not found
   */
  public async getById(id: string): Promise<T | null> {
    try {
      const docRef = this.firestoreService.document<T>(this.collectionName);
      const doc = await docRef.get();
      return doc ? doc : null;
    } catch (error) {
      throw new FrameworkError(`Failed to get document ${id} from ${this.collectionName}`, {
        id,
        collection: this.collectionName,
        cause: error
      });
    }
  }

  /**
   * Gets all documents from the collection.
   * @returns Promise containing an array of document data
   */
  public async getAll(): Promise<T[]> {
    try {
      const collectionRef = this.firestoreService.collection<T>(this.collectionName);
      const docs = await collectionRef.get();
      return docs.map(doc => doc);
    } catch (error) {
      throw new FrameworkError(`Failed to get all documents from ${this.collectionName}`, {
        collection: this.collectionName,
        cause: error
      });
    }
  }

  /**
   * Creates a new document in the collection.
   * @param data - The data to create
   * @returns Promise containing the new document ID
   */
  public async create(data: T): Promise<string> {
    try {
      const collectionRef = this.firestoreService.collection<T>(this.collectionName);
      const docRef = await collectionRef.add(data);
      return docRef.id;
    } catch (error) {
      throw new FrameworkError(`Failed to create document in ${this.collectionName}`, {
        data,
        collection: this.collectionName,
        cause: error
      });
    }
  }

  /**
   * Updates an existing document.
   * @param id - The document ID
   * @param data - The data to update
   */
  public async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = this.firestoreService.document<T>(`${this.collectionName}/${id}`);
      await docRef.update(data);
    } catch (error) {
      throw new FrameworkError(`Failed to update document ${id} in ${this.collectionName}`, {
        id,
        data,
        collection: this.collectionName,
        cause: error
      });
    }
  }

  /**
   * Deletes a document by ID.
   * @param id - The document ID
   */
  public async delete(id: string): Promise<void> {
    try {
      const docRef = this.firestoreService.document<T>(`${this.collectionName}/${id}`);
      await docRef.delete();
    } catch (error) {
      throw new FrameworkError(`Failed to delete document ${id} from ${this.collectionName}`, {
        id,
        collection: this.collectionName,
        cause: error
      });
    }
  }
}
