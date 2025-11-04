export interface BugReporterConfig {
  apiKey: string;
  apiUrl: string;
  enabled?: boolean;
  debug?: boolean;
  userContext?: {
    userId?: string;
    email?: string;
    name?: string;
  };
}

export interface ApiClientConfig {
  apiUrl: string;
  apiKey: string;
  debug?: boolean;
}
