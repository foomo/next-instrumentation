import { registerLogger } from './logger';
import { registerOpentelemetry } from './opentelementry';
import { registerProfiler } from './profiler';

export * from './logger';
export * from './opentelementry';
export * from './profiler';

export const register = async () => {
	await registerLogger();
	await registerOpentelemetry();
	await registerProfiler();
};
