import { registerLogger } from './logger';
import { registerOpentelemetry } from './opentelementry';

export { registerLogger } from './logger';
export { registerOpentelemetry } from './opentelementry';

export const register = async () => {
	await registerLogger();
	await registerOpentelemetry();
};
