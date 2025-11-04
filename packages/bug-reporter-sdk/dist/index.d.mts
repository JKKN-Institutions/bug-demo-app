import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { SubmitBugReportRequest, BugReport, GetMyBugReportsResponse, GetBugReportDetailsResponse, SendBugReportMessageResponse } from '@bug-reporter/shared';
export { ApiResponse, BugReport, BugReportCategory, BugReportMessage, BugReportStatus, GetBugReportDetailsResponse, GetMyBugReportsResponse, SendBugReportMessageRequest, SendBugReportMessageResponse, SubmitBugReportRequest, SubmitBugReportResponse } from '@bug-reporter/shared';

interface BugReporterConfig {
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
interface ApiClientConfig {
    apiUrl: string;
    apiKey: string;
    debug?: boolean;
}

declare class BugReporterApiClient {
    private config;
    constructor(config: ApiClientConfig);
    private request;
    /**
     * Submit a new bug report
     */
    createBugReport(payload: SubmitBugReportRequest): Promise<BugReport>;
    /**
     * Get all bug reports for this application
     */
    getMyBugReports(options?: {
        page?: number;
        limit?: number;
        status?: string;
        category?: string;
        search?: string;
    }): Promise<GetMyBugReportsResponse>;
    /**
     * Get details of a specific bug report
     */
    getBugReportById(id: string, includeMessages?: boolean): Promise<GetBugReportDetailsResponse>;
    /**
     * Send a message on a bug report
     */
    sendMessage(bugReportId: string, messageText: string, attachments?: string[]): Promise<SendBugReportMessageResponse>;
}

interface BugReporterContextValue {
    apiClient: BugReporterApiClient | null;
    config: BugReporterConfig;
    isEnabled: boolean;
}
interface BugReporterProviderProps {
    children: ReactNode;
    apiKey: string;
    apiUrl: string;
    enabled?: boolean;
    debug?: boolean;
    userContext?: BugReporterConfig['userContext'];
}
declare function BugReporterProvider({ children, apiKey, apiUrl, enabled, debug, userContext, }: BugReporterProviderProps): react_jsx_runtime.JSX.Element;

declare function BugReporterWidget(): react_jsx_runtime.JSX.Element | null;

declare function MyBugsPanel(): react_jsx_runtime.JSX.Element | null;

declare function useBugReporter(): BugReporterContextValue;

export { type ApiClientConfig, type BugReporterConfig, BugReporterProvider, BugReporterWidget, MyBugsPanel, useBugReporter };
