// src/lib/utils/errorReporting.ts
// Error tracking and reporting utilities for production

interface ErrorReport {
  message: string;
  stack?: string;
  timestamp: number;
  userAgent: string;
  url: string;
  component?: string;
  operation?: string;
  metadata?: Record<string, any>;
}

class ErrorReporter {
  private reports: ErrorReport[] = [];
  private readonly maxReports = 50;
  private isProduction = false;

  constructor() {
    // Detect production environment
    this.isProduction = typeof window !== 'undefined' &&
                       !window.location.hostname.includes('localhost') &&
                       !window.location.hostname.includes('127.0.0.1');
  }

  /**
   * Report an error with optional metadata
   */
  report(error: Error | string, metadata?: Record<string, any>): void {
    const errorObj = typeof error === 'string' ? new Error(error) : error;

    const report: ErrorReport = {
      message: errorObj.message,
      stack: errorObj.stack,
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      ...metadata
    };

    this.reports.push(report);

    // Keep only recent reports
    if (this.reports.length > this.maxReports) {
      this.reports = this.reports.slice(-this.maxReports);
    }

    // In production, send to error tracking service
    if (this.isProduction) {
      this.sendToService(report);
    } else {
      // In development, log to console
      console.error('Error reported:', report);
    }
  }

  /**
   * Get all error reports (for debugging)
   */
  getReports(): ErrorReport[] {
    return [...this.reports];
  }

  /**
   * Clear all reports
   */
  clearReports(): void {
    this.reports = [];
  }

  /**
   * Send report to external error tracking service
   * In a real implementation, this would send to services like Sentry, Rollbar, etc.
   */
  private sendToService(report: ErrorReport): void {
    // Placeholder for external error tracking service integration
    // Example implementations:

    // Sentry
    // Sentry.captureException(new Error(report.message), {
    //   tags: { component: report.component },
    //   extra: report.metadata
    // });

    // Rollbar
    // Rollbar.error(report.message, report);

    // For now, just store locally
    console.warn('Production error (would send to service):', report);
  }
}

// Global error reporter instance
export const errorReporter = new ErrorReporter();

// Enhanced error handling utility
export function reportError(error: Error | string, metadata?: Record<string, any>): void {
  errorReporter.report(error, metadata);
}

// Hook for components to report errors
export function useErrorReporting(componentName?: string) {
  const report = (error: Error | string, metadata?: Record<string, any>) => {
    reportError(error, { component: componentName, ...metadata });
  };

  return { report };
}