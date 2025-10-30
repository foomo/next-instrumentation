export const registerLogger = async () => {
	await require('pino');
	await require('next-logger');
	console.info('Registered logger');
};
