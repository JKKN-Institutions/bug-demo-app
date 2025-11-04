'use client';

import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { BugReporterApiClient } from '../api/client';
import type { BugReporterConfig } from '../types/config';
import { BugReporterWidget } from './BugReporterWidget';
import { consoleLogger } from '../utils/console-logger';

export interface BugReporterContextValue {
  apiClient: BugReporterApiClient | null;
  config: BugReporterConfig;
  isEnabled: boolean;
}

export const BugReporterContext = createContext<BugReporterContextValue | null>(null);

interface BugReporterProviderProps {
  children: ReactNode;
  apiKey: string;
  apiUrl: string;
  enabled?: boolean;
  debug?: boolean;
  userContext?: BugReporterConfig['userContext'];
}

export function BugReporterProvider({
  children,
  apiKey,
  apiUrl,
  enabled = true,
  debug = false,
  userContext,
}: BugReporterProviderProps) {
  const [apiClient, setApiClient] = useState<BugReporterApiClient | null>(null);

  const config: BugReporterConfig = {
    apiKey,
    apiUrl,
    enabled,
    debug,
    userContext,
  };

  useEffect(() => {
    if (enabled && apiKey && apiUrl) {
      const client = new BugReporterApiClient({
        apiUrl,
        apiKey,
        debug,
      });
      setApiClient(client);

      // Start capturing console logs
      consoleLogger.startCapture();

      if (debug) {
        console.log('[BugReporter SDK] Initialized with config:', {
          apiUrl,
          enabled,
          hasUserContext: !!userContext,
        });
      }
    }

    // Cleanup: stop capturing on unmount
    return () => {
      if (enabled) {
        consoleLogger.stopCapture();
      }
    };
  }, [apiKey, apiUrl, enabled, debug, userContext]);

  return (
    <BugReporterContext.Provider value={{ apiClient, config, isEnabled: enabled }}>
      {children}
      {/* Auto-render BugReporterWidget */}
      {enabled && apiClient && <BugReporterWidget />}
    </BugReporterContext.Provider>
  );
}
