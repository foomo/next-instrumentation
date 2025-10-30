import { ClientRequest } from 'node:http';
import { metrics } from '@opentelemetry/api';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { HostMetrics } from '@opentelemetry/host-metrics';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import type { MeterProvider } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
	ParentBasedSampler,
	TraceIdRatioBasedSampler,
} from '@opentelemetry/sdk-trace-base';
import { newResource } from './resource';
import { getEnvBoolean, getEnvNumber } from './utils';

export const registerOpentelemetry = async () => {
	if (!getEnvBoolean('OTEL_ENABLED')) return;

	const sdk = new NodeSDK({
		sampler: new ParentBasedSampler({
			root: new TraceIdRatioBasedSampler(getEnvNumber('OTEL_TRACE_RATIO') ?? 1),
		}),
		traceExporter: new OTLPTraceExporter({
			url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT as string,
		}),
		metricReaders: [new PrometheusExporter({ host: '0.0.0.0', port: 9200 })],
		resource: newResource(),
		instrumentations: [
			new HttpInstrumentation({
				requestHook: (span, request) => {
					if (!(request instanceof ClientRequest)) {
						const pathname =
							request.headers['x-base-path'] || request.url || '/';
						span.updateName(`HTTP ${request.method} ${pathname}`);
						span.setAttribute('http.target', pathname);
					}
				},
				ignoreIncomingRequestHook: (request) =>
					['/_next', '/metrics', '/static'].some((prefix) =>
						request.url?.startsWith(prefix),
					),
			}),
		],
	});

	try {
		sdk.start();
		console.error('OpenTelemetry automatic instrumentation started successfully');
	} catch (error) {
		console.error(
			'Error initializing OpenTelemetry SDK. Your application is not instrumented and will not produce telemetry',
			error,
		);
	}

	const hostMetricsMonitoring = new HostMetrics({
		name: 'instance-host-metrics',
		meterProvider: metrics.getMeterProvider() as MeterProvider,
	});
	hostMetricsMonitoring.start();

	// handle shutdown
	['SIGINT', 'SIGTERM'].forEach((signal) => {
		process.on(signal, async () => await sdk.shutdown());
	});
	console.info('Registered opentelemetry');
};
