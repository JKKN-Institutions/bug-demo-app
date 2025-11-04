import type {
  BugReport,
  ApiResponse,
  SubmitBugReportRequest,
  SubmitBugReportResponse,
  GetMyBugReportsResponse,
  GetBugReportDetailsResponse,
  SendBugReportMessageRequest,
  SendBugReportMessageResponse,
} from '@bug-reporter/shared';
import type { ApiClientConfig } from '../types/config';

export class BugReporterApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.apiUrl}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.config.apiKey,
      ...options.headers,
    };

    if (this.config.debug) {
      console.log('[BugReporter SDK] Request:', { url, method: options.method || 'GET' });
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      const errorMessage = data.error?.message || `HTTP ${response.status}`;
      const error = new Error(errorMessage);
      if (this.config.debug) {
        console.error('[BugReporter SDK] Error:', data.error);
      }
      throw error;
    }

    if (this.config.debug) {
      console.log('[BugReporter SDK] Response:', data.data);
    }

    return data.data as T;
  }

  /**
   * Submit a new bug report
   */
  async createBugReport(payload: SubmitBugReportRequest): Promise<BugReport> {
    const response = await this.request<SubmitBugReportResponse>(
      '/api/v1/public/bug-reports',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    return response.bug_report;
  }

  /**
   * Get all bug reports for this application
   */
  async getMyBugReports(options?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
  }): Promise<GetMyBugReportsResponse> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.status) params.append('status', options.status);
    if (options?.category) params.append('category', options.category);
    if (options?.search) params.append('search', options.search);

    const queryString = params.toString();
    const endpoint = queryString
      ? `/api/v1/public/bug-reports/me?${queryString}`
      : '/api/v1/public/bug-reports/me';

    return this.request<GetMyBugReportsResponse>(endpoint);
  }

  /**
   * Get details of a specific bug report
   */
  async getBugReportById(
    id: string,
    includeMessages: boolean = true
  ): Promise<GetBugReportDetailsResponse> {
    const params = new URLSearchParams();
    if (!includeMessages) params.append('include_messages', 'false');

    const queryString = params.toString();
    const endpoint = queryString
      ? `/api/v1/public/bug-reports/${id}?${queryString}`
      : `/api/v1/public/bug-reports/${id}`;

    return this.request<GetBugReportDetailsResponse>(endpoint);
  }

  /**
   * Send a message on a bug report
   */
  async sendMessage(
    bugReportId: string,
    messageText: string,
    attachments?: string[]
  ): Promise<SendBugReportMessageResponse> {
    const payload: SendBugReportMessageRequest = {
      bug_report_id: bugReportId,
      message: messageText,
      attachments,
    };

    return this.request<SendBugReportMessageResponse>(
      `/api/v1/public/bug-reports/${bugReportId}/messages`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  }
}
