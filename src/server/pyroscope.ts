import { newResource } from './resource.ts'
import { getEnvBoolean } from './utils.ts'

export const registerPyroscope = async (): Promise<void> => {
	if (
		!getEnvBoolean('OTEL_ENABLED') ||
		!process.env.PYROSCOPE_ADHOC_SERVER_ADDRESS
	)
		return

	// Dynamically import Pyroscope SDK (Node.js only)
	const { init, start, stop } = await import('@pyroscope/nodejs')

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
		wall: {
			collectCpuTime: true,
		},
	}

	console.debug(JSON.stringify(config))

	init(config)
	try {
		start()

		// handle shutdown
		;['SIGINT', 'SIGTERM'].forEach((signal) => {
			process.on(signal, async () => await stop())
		})

		console.info('Pyroscope started successfully')
	} catch (err) {
		console.error({ err: err }, 'Pyroscope initialization failed')
	}
}
