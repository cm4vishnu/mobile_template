import { PushNotifications, PushNotificationSchema, Token, PermissionStatus as CapPermissionStatus } from '@capacitor/push-notifications';
import { FrameworkError } from '@/utils/errors';

/**
 * Represents a push notification token.
 */
export interface PushToken {
  value: string;
  platform: 'ios' | 'android' | 'web';
}

/**
 * Represents a push notification payload.
 */
export interface NotificationPayload {
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Represents the permission status for push notifications.
 */
export interface PermissionStatus {
  receive: 'granted' | 'denied' | 'prompt' | 'prompt-with-rationale';
}

/**
 * PushNotificationService provides a singleton wrapper around the Capacitor Push Notifications plugin.
 * It handles token registration, permission management, and notification listeners.
 */
export class PushNotificationService {
  private static instance: PushNotificationService;
  private token: PushToken | null = null;
  private initialized = false;
  private listeners: {
    registration?: (token: PushToken) => void;
    registrationError?: (error: Error) => void;
    pushNotificationReceived?: (notification: PushNotificationSchema) => void;
    pushNotificationActionPerformed?: (notification: PushNotificationSchema) => void;
  } = {};

  private constructor() {}

  /**
   * Returns the singleton instance of PushNotificationService.
   */
  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Initializes the push notifications service.
   * Must be called before any other methods.
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Request permissions first
      await this.requestPermissions();

      // Register for push notifications
      await this.register();

      this.initialized = true;
    } catch (error) {
      throw new FrameworkError('Failed to initialize push notifications', { cause: error });
    }
  }

  /**
   * Requests permission to receive push notifications.
   * @returns Promise resolving to the permission status
   */
  public async requestPermissions(): Promise<PermissionStatus> {
    try {
      const result = await PushNotifications.requestPermissions();
      return {
        receive: result.receive,
      };
    } catch (error) {
      throw new FrameworkError('Failed to request push notification permissions', { cause: error });
    }
  }

  /**
   * Registers the device for push notifications.
   * This will trigger the 'registration' or 'registrationError' event.
   */
  public async register(): Promise<void> {
    try {
      await PushNotifications.register();
    } catch (error) {
      throw new FrameworkError('Failed to register for push notifications', { cause: error });
    }
  }

  /**
   * Unregisters the device from push notifications.
   */
  public async unregister(): Promise<void> {
    try {
      await PushNotifications.unregister();
      this.token = null;
    } catch (error) {
      throw new FrameworkError('Failed to unregister from push notifications', { cause: error });
    }
  }

  /**
   * Gets the current device push token.
   * @returns The push token or null if not available
   */
  public getToken(): PushToken | null {
    return this.token;
  }

  /**
   * Adds listeners for push notification events.
   * @param callbacks - Object containing callback functions for each event
   * @returns An object with a remove method to remove all added listeners
   */
  public addListeners(callbacks: {
    onRegistration?: (token: PushToken) => void;
    onRegistrationError?: (error: Error) => void;
    onPushNotificationReceived?: (notification: PushNotificationSchema) => void;
    onPushNotificationActionPerformed?: (notification: PushNotificationSchema) => void;
  }): { remove: () => void } {
    this.listeners = {
      registration: callbacks.onRegistration,
      registrationError: callbacks.onRegistrationError,
      pushNotificationReceived: callbacks.onPushNotificationReceived,
      pushNotificationActionPerformed: callbacks.onPushNotificationActionPerformed,
    };

    // Set up Capacitor listeners
    const registrationListener = PushNotifications.addListener('registration', (token: Token) => {
      const pushToken: PushToken = {
        value: token.value,
        platform: this.getPlatform(),
      };
      this.token = pushToken;
      this.listeners.registration?.(pushToken);
    });

    const registrationErrorListener = PushNotifications.addListener('registrationError', (error: { message: string }) => {
      const err = new Error(error.message);
      this.listeners.registrationError?.(err);
    });

    const pushNotificationReceivedListener = PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      this.listeners.pushNotificationReceived?.(notification);
    });

    const pushNotificationActionPerformedListener = PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationSchema) => {
      this.listeners.pushNotificationActionPerformed?.(notification);
    });

    // Return a remove function that removes all listeners
    return {
      remove: async () => {
        await registrationListener.remove();
        await registrationErrorListener.remove();
        await pushNotificationReceivedListener.remove();
        await pushNotificationActionPerformedListener.remove();
        this.listeners = {};
      },
    };
  }

  /**
   * Removes all push notification listeners.
   */
  public async removeListeners(): Promise<void> {
    try {
      await PushNotifications.removeAllListeners();
      this.listeners = {};
    } catch (error) {
      throw new FrameworkError('Failed to remove push notification listeners', { cause: error });
    }
  }

  /**
   * Checks the current permission status for push notifications.
   * @returns Promise resolving to the permission status
   */
  public async checkPermissions(): Promise<PermissionStatus> {
    try {
      const result = await PushNotifications.checkPermissions();
      return {
        receive: result.receive,
      };
    } catch (error) {
      throw new FrameworkError('Failed to check push notification permissions', { cause: error });
    }
  }

  /**
   * Gets the current platform.
   */
  private getPlatform(): 'ios' | 'android' | 'web' {
    // Capacitor's PushNotifications plugin only works on iOS and Android
    // We can use the Capacitor core to get the platform, but for simplicity we assume mobile.
    // In a real app, you might import { Capacitor } from '@capacitor/core';
    // and use Capacitor.getPlatform().
    // Since we cannot import here without adding dependency, we'll default to 'android' for non-iOS.
    // However, the plugin only works on iOS and Android, so we can safely assume one of them.
    // We'll use a simple heuristic: if the user agent contains 'iPhone' or 'iPad', it's iOS.
    if (typeof navigator !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
      return 'ios';
    }
    return 'android';
  }
}

export const pushNotificationService = PushNotificationService.getInstance();
export default PushNotificationService;