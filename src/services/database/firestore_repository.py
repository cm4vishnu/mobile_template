<dyad-write path="src/services/database/firestore.py" description="Creating a FirestoreRepository class for CRUD operations on collections.">
import { FirestoreService } from '@/services/database/firestore'
import { FrameworkError } from '@/utils/errors'

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
   * @returns Promise containing the document data or null if<unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk><unk>
</parameter>
</function>
</tool_call><dyad-write path="src/services/camera/CameraService.ts" description="Create CameraService singleton for Capacitor Camera integration.">
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FrameworkError } from '@/utils/errors';

export interface CameraPhoto {
  path: string;
  webPath?: string;
  base64?: string;
  width: number;
  height: number;
  fileSize: number;
  createdAt: Date;
}

export interface CameraOptions {
  quality?: number;
  allowEditing?: boolean;
  resultType?: CameraResultType;
  source?: CameraSource;
  width?: number;
  height?: number;
  saveToGallery?: boolean;
}

export interface PermissionStatus {
  authorized: boolean;
  camera: boolean;
  photos: boolean;
}

/**
 * CameraService provides a singleton wrapper around the Capacitor Camera plugin.
 * It handles photo capture, gallery selection, permissions, and file saving.
 */
export class CameraService {
  private static instance: CameraService;

  private constructor() {}

  /**
   * Returns the singleton instance of CameraService.
   */
  public static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService();
    }
    return CameraService.instance;
  }

  /**
   * Takes a photo using the device camera.
   * @param options - Optional camera options
   * @returns Promise resolving to the captured photo
   */
  public async takePhoto(options?: CameraOptions): Promise<CameraPhoto> {
    try {
      const cameraOptions: Parameters<typeof Camera.getPhoto>[0] = {
        resultType: options?.resultType ?? CameraResultType.Uri,
        source: options?.source ?? CameraSource.Camera,
        quality: options?.quality ?? 80,
        allowEditing: options?.allowEditing ?? false,
        width: options?.width,
        height: options?.height,
        saveToGallery: options?.saveToGallery ?? false,
      };

      const photo = await Camera.getPhoto(cameraOptions);
      return this.normalizePhoto(photo);
    } catch (error) {
      throw new FrameworkError('Failed to take photo', { cause: error });
    }
  }

  /**
   * Picks a photo from the device gallery.
   * @param options - Optional camera options
   * @returns Promise resolving to the selected photo
   */
  public async pickFromGallery(options?: CameraOptions): Promise<CameraPhoto> {
    try {
      const cameraOptions: Parameters<typeof Camera.getPhoto>[0] = {
        resultType: options?.resultType ?? CameraResultType.Uri,
        source: CameraSource.PhotosLibrary,
        quality: options?.quality ?? 80,
        allowEditing: options?.allowEditing ?? false,
        width: options?.width,
        height: options?.height,
      };

      const photo = await Camera.getPhoto(cameraOptions);
      return this.normalizePhoto(photo);
    } catch (error) {
      throw new FrameworkError('Failed to pick photo from gallery', { cause: error });
    }
  }

  /**
   * Requests camera and photo permissions.
   * @returns Promise resolving to the permission status
   */
  public async requestPermissions(): Promise<PermissionStatus> {
    try {
      const result = await Camera.requestPermissions();
      return {
        authorized: result.camera === 'granted' || result.photos === 'granted',
        camera: result.camera === 'granted',
        photos: result.photos === 'granted',
      };
    } catch (error) {
      throw new FrameworkError('Failed to request camera permissions', { cause: error });
    }
  }

  /**
   * Checks current camera and photo permissions.
   * @returns Promise resolving to the permission status
   */
  public async checkPermissions(): Promise<PermissionStatus> {
    try {
      const result = await Camera.checkPermissions();
      return {
        authorized: result.camera === 'granted' || result.photos === 'granted',
        camera: result.camera === 'granted',
        photos: result.photos === 'granted',
      };
    } catch (error) {
      throw new FrameworkError('Failed to check camera permissions', { cause: error });
    }
  }

  /**
   * Saves a photo to the app's documents directory.
   * @param photo - The photo to save
   * @param fileName - Optional file name
   * @returns Promise resolving to the saved file path
   */
  public async savePhoto(photo: CameraPhoto, fileName?: string): Promise<string> {
    try {
      const name = fileName ?? `photo_${Date.now()}.jpg`;
      const base64Data = photo.base64 ?? await this.fetchBase64(photo.path);

      await Filesystem.writeFile({
        path: name,
        data: base64Data,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });

      return `${Directory.Data}/${name}`;
    } catch (error) {
      throw new FrameworkError('Failed to save photo', { cause: error });
    }
  }

  /**
   * Normalizes a Capacitor Photo into a CameraPhoto.
   */
  private normalizePhoto(photo: Photo): CameraPhoto {
    return {
      path: photo.path ?? '',
      webPath: photo.webPath,
      base64: photo.base64,
      width: photo.width ?? 0,
      height: photo.height ?? 0,
      fileSize: photo.fileSize ?? 0,
      createdAt: new Date(),
    };
  }

  /**
   * Fetches base64 data from a file path.
   */
  private async fetchBase64(filePath: string): Promise<string> {
    try {
      const readResult = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data,
      });
      return readResult.data;
    } catch {
      return '';
    }
  }
}

export const cameraService = CameraService.getInstance();
export default CameraService;