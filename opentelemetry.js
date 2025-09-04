const opentelemetry = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:3000/api/signals', // Replace with your signals endpoint
  }),
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'zenith-backend',
  }),
});

sdk.start();