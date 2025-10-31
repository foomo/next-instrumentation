import type { PushLogOptions } from '@grafana/faro-core/dist/bundle/types'
import { faro, LogLevel } from '@grafana/faro-web-sdk'

export const logError = (args: unknown[], options?: PushLogOptions): void => {
	pushLog(args, { ...options, level: LogLevel.ERROR })
}

export const logWarn = (args: unknown[], options?: PushLogOptions): void => {
	pushLog(args, { ...options, level: LogLevel.WARN })
}

export const logInfo = (args: unknown[], options?: PushLogOptions): void => {
	pushLog(args, { ...options, level: LogLevel.INFO })
}

export const logDebug = (args: unknown[], options?: PushLogOptions): void => {
	pushLog(args, { ...options, level: LogLevel.DEBUG })
}

export const logTrace = (args: unknown[], options?: PushLogOptions): void => {
	pushLog(args, { ...options, level: LogLevel.TRACE })
}

export const pushLog = (args: unknown[], options?: PushLogOptions): void => {
	if (!args || args.length === 0) return
	if (!faro.api) {
		console.info('Faro.pushLog', args)
		return
	}
	faro.api.pushLog(args, options)
}
