import { registerOtel } from './otel.ts'
import { registerPyroscope } from './pyroscope.ts'

export const register = (): void => {
	registerOtel()
	registerPyroscope()
}
