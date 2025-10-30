import { registerLogger } from './logger';
import { registerOpentelemetry } from './opentelementry';

export * from './logger';
export * from './opentelementry';

export const register = async () => {
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		await registerLogger();
		await registerOpentelemetry();
	}
};
