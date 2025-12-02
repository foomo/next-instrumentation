import { registerOtel } from './otel.ts'
import { registerPyroscope } from './pyroscope.ts'

export const register = async (): Promise<void> => {
	registerOtel()
	await registerPyroscope()
}
