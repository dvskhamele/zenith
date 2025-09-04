// Comprehensive Debug Logger with Automatic Error Reporting
// This provides integrated debugging without UI elements

class DebugLogger {
  private appName = 'Zenith';
  private version = '1.0.0';
  private sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  private logs: any[] = [];
  private errors: any[] = [];
  private performanceMarks: Record<string, number> = {};

  // Log info messages
  info(message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      data,
      sessionId: this.sessionId
    };
    
    this.logs.push(logEntry);
    console.log(`[${this.appName}] INFO:`, message, data || '');
    
    // Auto-report if needed
    this.autoReportIfNeeded(logEntry);
  }

  // Log warning messages
  warn(message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      data,
      sessionId: this.sessionId
    };
    
    this.logs.push(logEntry);
    console.warn(`[${this.appName}] WARN:`, message, data || '');
    
    // Auto-report if needed
    this.autoReportIfNeeded(logEntry);
  }

  // Log error messages with automatic reporting
  error(message: string, error?: any, context?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : undefined,
      context,
      sessionId: this.sessionId
    };
    
    this.errors.push(logEntry);
    this.logs.push(logEntry);
    
    console.error(`[${this.appName}] ERROR:`, message, error || '', context || '');
    
    // Automatically report errors
    this.reportError(logEntry);
  }

  // Log debug messages
  debug(message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'debug',
      message,
      data,
      sessionId: this.sessionId
    };
    
    this.logs.push(logEntry);
    console.debug(`[${this.appName}] DEBUG:`, message, data || '');
  }

  // Performance timing
  mark(name: string) {
    this.performanceMarks[name] = performance.now();
    this.info(`Performance mark: ${name}`, { timestamp: this.performanceMarks[name] });
  }

  // Measure time between marks
  measure(startMark: string, endMark: string) {
    const start = this.performanceMarks[startMark];
    const end = this.performanceMarks[endMark];
    
    if (start !== undefined && end !== undefined) {
      const duration = end - start;
      this.info(`Performance measurement: ${startMark} to ${endMark}`, { duration: `${duration.toFixed(2)}ms` });
      return duration;
    }
    
    return null;
  }

  // Automatic error reporting
  private async reportError(logEntry: any) {
    try {
      // In development, log to console
      if (process.env.NODE_ENV === 'development') {
        console.log('=== AUTO ERROR REPORT ===');
        console.log('Session ID:', this.sessionId);
        console.log('Error:', logEntry);
        console.log('========================');
      }
      
      // In production, send to error reporting service
      // For now, we'll just log locally
      await this.saveToLocalReport(logEntry);
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  }

  // Auto-report based on conditions
  private autoReportIfNeeded(logEntry: any) {
    // Report if it's an error or meets certain criteria
    if (logEntry.level === 'error') {
      this.reportError(logEntry);
    }
    
    // Report if it contains specific keywords
    const autoReportKeywords = ['failed', 'error', 'exception', 'timeout', 'network'];
    if (autoReportKeywords.some(keyword => 
      logEntry.message.toLowerCase().includes(keyword) ||
      (logEntry.data && JSON.stringify(logEntry.data).toLowerCase().includes(keyword))
    )) {
      this.reportError(logEntry);
    }
  }

  // Save to local error report (simulating error reporting service)
  private async saveToLocalReport(logEntry: any) {
    try {
      if (typeof window !== 'undefined') {
        // Get existing reports
        const existingReports = localStorage.getItem('zenith_error_reports');
        const reports = existingReports ? JSON.parse(existingReports) : [];
        
        // Add new report
        reports.push({
          ...logEntry,
          reportedAt: new Date().toISOString()
        });
        
        // Keep only last 50 reports
        const recentReports = reports.slice(-50);
        
        // Save back to localStorage
        localStorage.setItem('zenith_error_reports', JSON.stringify(recentReports));
        
        console.log(`[${this.appName}] Error report saved locally`);
      }
    } catch (error) {
      console.error('Failed to save error report:', error);
    }
  }

  // Get all logs
  getLogs() {
    return this.logs;
  }

  // Get all errors
  getErrors() {
    return this.errors;
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    this.errors = [];
    this.performanceMarks = {};
  }

  // Export logs for debugging
  exportLogs() {
    return {
      app: this.appName,
      version: this.version,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      logs: this.logs,
      errors: this.errors,
      performanceMarks: this.performanceMarks
    };
  }

  // Send logs to debugging endpoint
  async sendLogsToDebugEndpoint() {
    try {
      const debugData = this.exportLogs();
      
      // In a real app, this would send to your debugging service
      console.log('=== DEBUG LOGS EXPORT ===');
      console.log(JSON.stringify(debugData, null, 2));
      console.log('========================');
      
      return debugData;
    } catch (error) {
      console.error('Failed to export debug logs:', error);
      return null;
    }
  }
}

// Export singleton instance
export const debugLogger = new DebugLogger();

// Export individual functions for convenience
export const logInfo = (message: string, data?: any) => debugLogger.info(message, data);
export const logWarn = (message: string, data?: any) => debugLogger.warn(message, data);
export const logError = (message: string, error?: any, context?: any) => debugLogger.error(message, error, context);
export const logDebug = (message: string, data?: any) => debugLogger.debug(message, data);
export const markPerformance = (name: string) => debugLogger.mark(name);
export const measurePerformance = (startMark: string, endMark: string) => debugLogger.measure(startMark, endMark);
export const getDebugLogs = () => debugLogger.getLogs();
export const getDebugErrors = () => debugLogger.getErrors();
export const exportDebugLogs = () => debugLogger.exportLogs();
export const sendDebugLogs = () => debugLogger.sendLogsToDebugEndpoint();