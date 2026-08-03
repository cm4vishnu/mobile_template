import {
  Filesystem,
  Directory,
  Encoding,
  ReadFileResult,
  WriteFileResult,
  AppendFileResult,
  DeleteFileResult,
  MkdirResult,
  ReaddirResult,
  StatResult,
} from '@capacitor/filesystem';
import { FrameworkError } from '@/utils/errors';

export interface FileInfo {
  path: string;
  name: string;
  size: number;
  type: string;
  modifiedAt: Date;
  isDirectory: boolean;
}

export interface ReadFileOptions {
  path: string;
  directory?: Directory;
  encoding?: Encoding;
}

export interface WriteFileOptions {
  path: string;
  data: string;
  directory?: Directory;
  encoding?: Encoding;
  recursive?: boolean;
}

export interface AppendFileOptions {
  path: string;
  data: string;
  directory?: Directory;
  encoding?: Encoding;
}

export interface DeleteFileOptions {
  path: string;
  directory?: Directory;
}

export interface CreateDirectoryOptions {
  path: string;
  directory?: Directory;
  recursive?: boolean;
}

export interface ListDirectoryOptions {
  path: string;
  directory?: Directory;
  recursive?: boolean;
}

export interface DownloadFileOptions {
  url: string;
  path: string;
  directory?: Directory;
  fileName?: string;
}

/**
 * FileSystemService provides a singleton wrapper around the Capacitor Filesystem plugin.
 * It handles file and directory operations with strong typing and error handling.
 */
export class FileSystemService {
  private static instance: FileSystemService;

  private constructor() {}

  /**
   * Returns the singleton instance of FileSystemService.
   */
  public static getInstance(): FileSystemService {
    if (!FileSystemService.instance) {
      FileSystemService.instance = new FileSystemService();
    }
    return FileSystemService.instance;
  }

  /**
   * Reads a file and returns its contents as a string.
   * @param options - Read file options
   * @returns Promise resolving to the file contents
   */
  public async readFile(options: ReadFileOptions): Promise<string> {
    try {
      const result = await Filesystem.readFile({
        path: options.path,
        directory: options.directory ?? Directory.Data,
        encoding: options.encoding ?? Encoding.UTF8,
      });
      return result.data;
    } catch (error) {
      throw new FrameworkError(`Failed to read file: ${options.path}`, { cause: error });
    }
  }

  /**
   * Writes data to a file, overwriting if it exists.
   * @param options - Write file options
   * @returns Promise resolving when the write is complete
   */
  public async writeFile(options: WriteFileOptions): Promise<void> {
    try {
      await Filesystem.writeFile({
        path: options.path,
        data: options.data,
        directory: options.directory ?? Directory.Data,
        encoding: options.encoding ?? Encoding.UTF8,
        recursive: options.recursive ?? false,
      });
    } catch (error) {
      throw new FrameworkError(`Failed to write file: ${options.path}`, { cause: error });
    }
  }

  /**
   * Appends data to an existing file.
   * @param options - Append file options
   * @returns Promise resolving when the append is complete
   */
  public async appendFile(options: AppendFileOptions): Promise<void> {
    try {
      await Filesystem.appendFile({
        path: options.path,
        data: options.data,
        directory: options.directory ?? Directory.Data,
        encoding: options.encoding ?? Encoding.UTF8,
      });
    } catch (error) {
      throw new FrameworkError(`Failed to append to file: ${options.path}`, { cause: error });
    }
  }

  /**
   * Deletes a file.
   * @param options - Delete file options
   * @returns Promise resolving when the deletion is complete
   */
  public async deleteFile(options: DeleteFileOptions): Promise<void> {
    try {
      await Filesystem.deleteFile({
        path: options.path,
        directory: options.directory ?? Directory.Data,
      });
    } catch (error) {
      throw new FrameworkError(`Failed to delete file: ${options.path}`, { cause: error });
    }
  }

  /**
   * Creates a directory.
   * @param options - Create directory options
   * @returns Promise resolving when the directory is created
   */
  public async createDirectory(options: CreateDirectoryOptions): Promise<void> {
    try {
      await Filesystem.mkdir({
        path: options.path,
        directory: options.directory ?? Directory.Data,
        recursive: options.recursive ?? false,
      });
    } catch (error) {
      throw new FrameworkError(`Failed to create directory: ${options.path}`, { cause: error });
    }
  }

  /**
   * Lists the contents of a directory.
   * @param options - List directory options
   * @returns Promise resolving to an array of FileInfo objects
   */
  public async listDirectory(options: ListDirectoryOptions): Promise<FileInfo[]> {
    try {
      const result = await Filesystem.readdir({
        path: options.path,
        directory: options.directory ?? Directory.Data,
      });

      return result.files.map((file) => ({
        path: file.uri ?? '',
        name: file.name ?? '',
        size: file.size ?? 0,
        type: file.type ?? '',
        modifiedAt: file.modifiedAt ? new Date(file.modifiedAt) : new Date(),
        isDirectory: file.type === 'directory',
      }));
    } catch (error) {
      throw new FrameworkError(`Failed to list directory: ${options.path}`, { cause: error });
    }
  }

  /**
   * Checks if a file or directory exists.
   * @param path - The path to check
   * @param directory - The directory to check in
   * @returns Promise resolving to true if the path exists
   */
  public async exists(path: string, directory?: Directory): Promise<boolean> {
    try {
      const result = await Filesystem.stat({
        path,
        directory: directory ?? Directory.Data,
      });
      return result.exists ?? false;
    } catch {
      return false;
    }
  }

  /**
   * Downloads a file from a URL and saves it to the filesystem.
   * @param options - Download file options
   * @returns Promise resolving to the local file path
   */
  public async downloadFile(options: DownloadFileOptions): Promise<string> {
    try {
      const response = await fetch(options.url);
      if (!response.ok) {
        throw new FrameworkError(
          `Failed to download file: HTTP ${response.status}`,
          { url: options.url, status: response.status }
        );
      }

      const blob = await response.blob();
      const base64Data = await this.blobToBase64(blob);
      const fileName = options.fileName ?? options.path.split('/').pop() ?? 'download';
      const fullPath = `${options.directory ?? Directory.Data}/${fileName}`;

      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: options.directory ?? Directory.Data,
        encoding: Encoding.UTF8,
        recursive: true,
      });

      return fullPath;
    } catch (error) {
      if (error instanceof FrameworkError) {
        throw error;
      }
      throw new FrameworkError(`Failed to download file from: ${options.url}`, { cause: error });
    }
  }

  /**
   * Converts a Blob to a base64 string.
   */
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1] ?? '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export const fileSystemService = FileSystemService.getInstance();
export default FileSystemService;