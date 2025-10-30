import { registerLogger } from './logger';
import { registerOpentelemetry } from './opentelementry';

export * from './faro';
export * from './logger';
export * from './opentelementry';

export const register = async () => {
	await registerLogger();
	await registerOpentelemetry();
};
