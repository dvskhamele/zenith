// frontend/telemetry.js
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';

// BetterStack configuration
const betterstackHost = 'https://s1501020.eu-nbg-2.betterstackdata.com';
const betterstackToken = 'bsvozJoDEnVAPLkEFWVWivT8';

const provider = new WebTracerProvider();
const exporter = new OTLPTraceExporter({
  url: `${betterstackHost}/v1/traces`,
  headers: {
    'Authorization': `Bearer ${betterstackToken}`,
  },
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations({
      '@opentelemetry/instrumentation-document-load': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-user-interaction': {
        enabled: true,
      },
    }),
  ],
});

export { provider };