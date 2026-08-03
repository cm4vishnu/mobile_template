import { Network, NetworkStatus } from '@capacitor/network';
import { FrameworkError } from '@/utils/errors';

export interface NetworkState {
  connected: boolean;
  connectionType: string;
  cellularGeneration: string | null;
  ipAddress: string;
  hostname: string;
}

export interface NetworkListener {
  remove: () => void;
}

/**
 * NetworkService provides a singleton wrapper around the Capacitor Network plugin.
 * It handles connectivity status, listening for changes, and React hook integration.
 */
export class NetworkService {
  private static instance: NetworkService;
  private listeners: Set<(status: NetworkState) => void> = new Set();
  private currentStatus: NetworkState;

  private constructor() {
    this.currentStatus = {
      connected: true,
      connectionType: 'unknown',
      cellularGeneration: null,
      ipAddress: '',
      hostname: '',
    };
  }

  /**
   * Returns the singleton instance of NetworkService.
   */
  public static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }

  /**
   * Gets the current network status.
   * @returns Promise resolving to the current network state
   */
  public async getStatus(): Promise<NetworkState> {
    try {
      const status = await Network.getStatus();
      this.currentStatus = this.normalizeStatus(status);
      return this.currentStatus;
    } catch (error) {
      throw new FrameworkError('Failed to get network status', { cause: error });
    }
  }

  /**
   * Checks if the device is currently online.
   * @returns Promise resolving to true if connected
   */
  public async isOnline(): Promise<boolean> {
    const status = await this.getStatus();
    return status.connected;
  }

  /**
   * Adds a listener for network status changes.
   * @param callback - Function called when network status changes
   * @returns A listener handle with a remove method
   */
  public addListener(callback: (status: NetworkState) => void): NetworkListener {
    this.listeners.add(callback);

    const remove = () => {
      this.listeners.delete(callback);
    };

    return { remove };
  }

  /**
   * Removes all network status listeners.
   */
  public removeListeners(): void {
    this.listeners.clear();
  }

  /**
   * Starts listening to native network change events.
   * Must be called to receive real-time connectivity updates.
   */
  public async startListening(): Promise<void> {
    try {
      await Network.addListener('networkStatusChange', (status) => {
        const normalized = this.normalizeStatus(status);
        this.currentStatus = normalized;
        this.notifyListeners(normalized);
      });
    } catch (error) {
      throw new FrameworkError('Failed to start network listener', { cause: error });
    }
  }

  /**
   * Stops listening to native network change events and removes all listeners.
   */
  public async stopListening(): Promise<void> {
    try {
      await Network.removeAllListeners();
      this.listeners.clear();
    } catch (error) {
      throw new FrameworkError('Failed to stop network listener', { cause: error });
    }
  }

  /**
   * Notifies all registered listeners of a network status change.
   */
  private notifyListeners(status: NetworkState): void {
    this.listeners.forEach((callback) => {
      try {
        callback(status);
      } catch {
        // Silently ignore listener errors to prevent one bad listener from breaking others
      }
    });
  }

  /**
   * Normalizes a Capacitor NetworkStatus into a NetworkState.
   */
  private normalizeStatus(status: NetworkStatus): NetworkState {
    return {
      connected: status.connected ?? true,
      connectionType: status.connectionType ?? 'unknown',
      cellularGeneration: status.cellularGeneration ?? null,
      ipAddress: status.ipAddress ?? '',
      hostname: status.hostname ?? '',
    };
  }
}

export const networkService = NetworkService.getInstance();
export default NetworkService;