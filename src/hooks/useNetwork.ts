import * as React from 'react';
import { NetworkService } from '@/services/network';
import { NetworkState } from '@/services/network';

/**
 * Custom hook for observing network connectivity changes.
 * Returns the current network state and automatically updates when connectivity changes.
 * 
 * @returns The current network state
 */
export function useNetwork(): NetworkState {
  const [networkState, setNetworkState] = React.useState<NetworkState>({
    connected: true,
    connectionType: 'unknown',
    cellularGeneration: null,
    ipAddress: '',
    hostname: '',
  });

  React.useEffect(() => {
    const service = NetworkService.getInstance();

    // Get initial status
    service.getStatus().then((status) => {
      setNetworkState(status);
    }).catch(() => {
      // Keep default state if status check fails
    });

    // Start listening for changes
    service.startListening().catch(() => {
      // Silently fail if native listening is not available
    });

    // Add listener for React state updates
    const listener = service.addListener((status) => {
      setNetworkState(status);
    });

    return () => {
      listener.remove();
    };
  }, []);

  return networkState;
}

export default useNetwork;