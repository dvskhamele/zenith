// frontend/index.js
import './telemetry'; // Initialize OpenTelemetry
import { logUserAction, logError } from './utils/logging';

// Example usage
logUserAction('App Loaded', { timestamp: new Date().toISOString() });

// Global error handler
window.addEventListener('error', (event) => {
  logError(event.error);
});