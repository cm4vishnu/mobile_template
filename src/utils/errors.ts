/**
 * FrameworkError is the base error class for all framework services.
 * It provides consistent error handling across the entire framework.
 */
export class FrameworkError extends Error {
  /**
   * The metadata associated with this error.
   * This can contain additional context about the error for debugging purposes.
   */
  public readonly metadata: Record<string, unknown>;

  /**
   * Creates a new FrameworkError.
   * @param message - The error message
   * @param metadata - Optional metadata for additional context
   */
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message);
    
    // Set the class name for better debugging
    this.name = 'FrameworkError';
    
    // Store metadata as a readonly property
    this.metadata = metadata || {};
    
    // Preserve the original stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}