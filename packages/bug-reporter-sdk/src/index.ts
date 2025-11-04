// Components
export { BugReporterProvider } from './components/BugReporterProvider';
export { BugReporterWidget } from './components/BugReporterWidget';
export { MyBugsPanel } from './components/MyBugsPanel';

// Hooks
export { useBugReporter } from './hooks/useBugReporter';

// Utils
export { consoleLogger } from './utils/console-logger';
export type { ConsoleLog } from './utils/console-logger';

// Types
export type { BugReporterConfig, ApiClientConfig } from './types/config';

// Re-export shared types for convenience
export type {
  BugReport,
  BugReportStatus,
  BugReportCategory,
  BugReportMessage,
  SubmitBugReportRequest,
  SubmitBugReportResponse,
  GetMyBugReportsResponse,
  GetBugReportDetailsResponse,
  SendBugReportMessageRequest,
  SendBugReportMessageResponse,
  ApiResponse,
} from '@bug-reporter/shared';
