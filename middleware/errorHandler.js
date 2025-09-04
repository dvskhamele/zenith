const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(err.stack);
  Sentry.captureException(err); // Send error to Sentry
  res.status(500).send({ error: 'Something went wrong!' });
}

module.exports = errorHandler;