import type { PushErrorOptions } from '@grafana/faro-core/dist/bundle/types'
import type { ErrorWithIndexProperties } from '@grafana/faro-core/dist/types/api/exceptions'
import { faro, LogLevel } from '@grafana/faro-web-sdk'

export const pushError = (
	error?: ErrorWithIndexProperties,
	options?: PushErrorOptions,
): void => {
	if (!error) return
	if (!faro.api) {
		console.error('Faro.pushError', error)
		return
	}
	faro.api.pushError(error, options)
}
