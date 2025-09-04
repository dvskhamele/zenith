// server.js
require('./telemetry'); // Initialize OpenTelemetry
const logger = require('./utils/logger');

logger.info('Server started');

// Your existing server code...