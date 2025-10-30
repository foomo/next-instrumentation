import {
	type BrowserConfig,
	faro,
	getWebInstrumentations,
	initializeFaro,
	LogLevel,
} from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { useEffect } from 'react';

export interface Faro {
	config?: BrowserConfig;
	enabled: boolean;
}

export const useFaro = ({ config, enabled }: Faro) => {
	useEffect(() => {
		if (enabled && !faro.api) {
			try {
				initializeFaro({
					instrumentations: [
						...getWebInstrumentations(),
						new TracingInstrumentation(),
					],
					consoleInstrumentation: {
						consoleErrorAsLog: true,
						captureConsoleDisabledLevels: [LogLevel.DEBUG, LogLevel.TRACE],
					},
					...config,
				} as BrowserConfig);
			} catch (e) {
				console.error('Failed to initialize Faro', e);
			}
		}
	}, [config, enabled]);
};
