// telemetry.js
const opentelemetry = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// BetterStack configuration from environment variables
const betterstackHost = 'https://s1501020.eu-nbg-2.betterstackdata.com';
const betterstackToken = 'bsvozJoDEnVAPLkEFWVWivT8';

const exporter = new OTLPTraceExporter({
  url: `${betterstackHost}/v1/traces`,
  headers: {
    'Authorization': `Bearer ${betterstackToken}`,
  },
});

const sdk = new opentelemetry.NodeSDK({
  traceExporter: exporter,
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'zenith-backend',
  }),
});

sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown().then(
    () => console.log('Telemetry shutdown complete'),
    (err) => console.error('Error shutting down telemetry', err)
  );
});