import * as Sentry from '@sentry/browser';

// Initialize Sentry for frontend (replace with your DSN)
Sentry.init({
  dsn: 'YOUR_FRONTEND_SENTRY_DSN',
});

// Send logs to dashboard "signals" endpoint
async function sendToSignals(log) {
  try {
    await fetch('/api/signals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });
  } catch (err) {
    console.error('Failed to send log to signals', err);
  }
}

export function logUserAction(action, details) {
  const log = { type: 'user-action', action, details, timestamp: new Date().toISOString() };
  console.log(`[User Action] ${action}`, details);
  sendToSignals(log);
}

export function logError(error) {
  const log = { type: 'error', message: error.message, stack: error.stack, timestamp: new Date().toISOString() };
  console.error('[Frontend Error]', error);
  Sentry.captureException(error);
  sendToSignals(log);
}