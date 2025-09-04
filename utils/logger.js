const winston = require('winston');
const Sentry = require('@sentry/node');
const axios = require('axios');

// Initialize Sentry (replace with your DSN)
Sentry.init({ dsn: 'YOUR_SENTRY_DSN_HERE' });

// Custom transport to send logs to dashboard "signals" endpoint
class SignalsTransport extends winston.Transport {
  async log(info, callback) {
    try {
      await axios.post('http://localhost:3000/api/signals', info);
    } catch (err) {
      console.error('Failed to send log to signals', err);
    }
    callback();
  }
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new SignalsTransport(),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;