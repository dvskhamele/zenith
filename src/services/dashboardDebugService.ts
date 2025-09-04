// DASHBOARD DEBUGGING & MONITORING SERVICE
// Built-in debugging and error reporting for the dashboard

class DashboardDebugService {
  private debugLogs: any[] = [];
  private errorLogs: any[] = [];
  private performanceMetrics: any = {};
  
  // Log debug information
  log(message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'debug',
      message,
      data
    };
    
    this.debugLogs.push(logEntry);
    console.log(`[DASHBOARD DEBUG] ${message}`, data || '');
    
    // Keep only last 100 logs
    if (this.debugLogs.length > 100) {
      this.debugLogs.shift();
    }
  }
  
  // Log errors
  error(message: string, error?: any) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      type: 'error',
      message,
      error
    };
    
    this.errorLogs.push(errorEntry);
    console.error(`[DASHBOARD ERROR] ${message}`, error || '');
    
    // Keep only last 100 errors
    if (this.errorLogs.length > 100) {
      this.errorLogs.shift();
    }
    
    // Report error to monitoring service
    this.reportError(message, error);
  }
  
  // Report errors to external service (in real implementation, this would send to your error tracking service)
  reportError(message: string, error?: any) {
    // In a real app, this would send to Sentry, PostHog, or similar
    console.log(`[ERROR REPORTED] ${message}`, error || '');
    
    // For now, we'll just log it
    // In production, you'd send this to your error tracking service
  }
  
  // Track performance metrics
  trackPerformance(metric: string, value: number) {
    if (!this.performanceMetrics[metric]) {
      this.performanceMetrics[metric] = [];
    }
    
    this.performanceMetrics[metric].push({
      timestamp: new Date().toISOString(),
      value
    });
    
    // Keep only last 50 measurements
    if (this.performanceMetrics[metric].length > 50) {
      this.performanceMetrics[metric].shift();
    }
    
    console.log(`[PERFORMANCE] ${metric}: ${value}ms`);
  }
  
  // Get all logs
  getLogs() {
    return {
      debug: this.debugLogs,
      errors: this.errorLogs,
      performance: this.performanceMetrics
    };
  }
  
  // Clear logs
  clearLogs() {
    this.debugLogs = [];
    this.errorLogs = [];
    this.performanceMetrics = {};
  }
  
  // Export logs for debugging
  exportLogs() {
    const logs = this.getLogs();
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-debug-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export const dashboardDebugService = new DashboardDebugService();

// Export individual functions for easy use
export const logDebug = (message: string, data?: any) => dashboardDebugService.log(message, data);
export const logError = (message: string, error?: any) => dashboardDebugService.error(message, error);
export const trackPerformance = (metric: string, value: number) => dashboardDebugService.trackPerformance(metric, value);
export const getDebugLogs = () => dashboardDebugService.getLogs();
export const exportDebugLogs = () => dashboardDebugService.exportLogs();
export const clearDebugLogs = () => dashboardDebugService.clearLogs();