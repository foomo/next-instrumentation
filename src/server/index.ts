import { registerLogger } from './logger';
import { registerOpentelemetry } from './opentelementry';

export * from './logger';
export * from './opentelementry';

export const register = async () => {
	console.info('Registering server modules');
	await registerLogger();
	await registerOpentelemetry();
};
