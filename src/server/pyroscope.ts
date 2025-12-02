import Pyroscope from '@pyroscope/nodejs'
import { newResource } from './resource.ts'
import { getEnvBoolean } from './utils.ts'

export const registerPyroscope = (): void => {
	if (
		!getEnvBoolean('OTEL_ENABLED') ||
		!process.env.PYROSCOPE_ADHOC_SERVER_ADDRESS
	)
		return

	const tags = {}
	let name = process.env.OTEL_SERVICE_NAME || 'undefined'
	const resource = newResource()

	for (let [key, value] of Object.entries(resource.attributes)) {
		switch (key) {
			case 'service.name': {
				name = `${value}`
				continue
			}
			case 'vcs.ref.head.revision': {
				key = 'service_git_ref'
				break
			}
			case 'vcs.repository.url.full': {
				key = 'service_repository'
				break
			}
			case 'vcs_repository_path': {
				key = 'service_root_path'
				break
			}
			default: {
				key = key.replace('.', '_')
				break
			}
		}
		tags[key] = value
	}

	const config = {
		serverAddress: process.env.PYROSCOPE_ADHOC_SERVER_ADDRESS,
		appName: name,
		tags: tags,
	}

	console.debug(JSON.stringify(config))

	Pyroscope.init(config)
	Pyroscope.start()

	// handle shutdown
	;['SIGINT', 'SIGTERM'].forEach(async (signal) => {
		await Pyroscope.stop()
	})
	console.info('Pyroscope started successfully')
}
