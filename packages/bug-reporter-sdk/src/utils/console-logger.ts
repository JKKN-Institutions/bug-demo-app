/**
 * Console Logger Utility
 * Captures console logs, warnings, and errors for bug reporting
 */

export interface ConsoleLog {
  level: 'log' | 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  args?: any[];
}

class ConsoleLogCapture {
  private logs: ConsoleLog[] = [];
  private maxLogs: number = 100;
  private isCapturing: boolean = false;
  private originalConsole: {
    log: typeof console.log;
    info: typeof console.info;
    warn: typeof console.warn;
    error: typeof console.error;
    debug: typeof console.debug;
  };

  constructor() {
    this.originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
    };
  }

  /**
   * Start capturing console logs
   */
  startCapture() {
    if (this.isCapturing) return;

    this.isCapturing = true;
    this.logs = [];

    // Override console.log
    console.log = (...args: any[]) => {
      this.captureLog('log', args);
      this.originalConsole.log.apply(console, args);
    };

    // Override console.info
    console.info = (...args: any[]) => {
      this.captureLog('info', args);
      this.originalConsole.info.apply(console, args);
    };

    // Override console.warn
    console.warn = (...args: any[]) => {
      this.captureLog('warn', args);
      this.originalConsole.warn.apply(console, args);
    };

    // Override console.error
    console.error = (...args: any[]) => {
      this.captureLog('error', args);
      this.originalConsole.error.apply(console, args);
    };

    // Override console.debug
    console.debug = (...args: any[]) => {
      this.captureLog('debug', args);
      this.originalConsole.debug.apply(console, args);
    };
  }

  /**
   * Stop capturing console logs
   */
  stopCapture() {
    if (!this.isCapturing) return;

    this.isCapturing = false;

    // Restore original console methods
    console.log = this.originalConsole.log;
    console.info = this.originalConsole.info;
    console.warn = this.originalConsole.warn;
    console.error = this.originalConsole.error;
    console.debug = this.originalConsole.debug;
  }

  /**
   * Capture a console log entry
   */
  private captureLog(level: ConsoleLog['level'], args: any[]) {
    try {
      // Convert arguments to strings
      const message = args
        .map((arg) => {
          if (typeof arg === 'string') return arg;
          if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
          try {
            return JSON.stringify(arg);
          } catch {
            return String(arg);
          }
        })
        .join(' ');

      const logEntry: ConsoleLog = {
        level,
        message,
        timestamp: new Date().toISOString(),
        args: args.map((arg) => {
          // Serialize args safely
          if (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean') {
            return arg;
          }
          if (arg instanceof Error) {
            return {
              name: arg.name,
              message: arg.message,
              stack: arg.stack,
            };
          }
          try {
            return JSON.parse(JSON.stringify(arg));
          } catch {
            return String(arg);
          }
        }),
      };

      this.logs.push(logEntry);

      // Keep only the last maxLogs entries
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(-this.maxLogs);
      }
    } catch (error) {
      // Fail silently to avoid interfering with the app
      this.originalConsole.error('[BugReporter] Failed to capture log:', error);
    }
  }

  /**
   * Get captured logs
   */
  getLogs(): ConsoleLog[] {
    return [...this.logs];
  }

  /**
   * Clear captured logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Get logs as JSON string
   */
  getLogsAsJson(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Export singleton instance
export const consoleLogger = new ConsoleLogCapture();
