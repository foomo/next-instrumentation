import {
	ATTR_VCS_REF_HEAD_REVISION,
	ATTR_VCS_REPOSITORY_URL_FULL,
} from '@opentelemetry/semantic-conventions/incubating';
import Pyroscope from '@pyroscope/nodejs';
import { newResource } from './resource';
import { getEnvBoolean } from './utils';

export const registerProfiler = async () => {
	if (!getEnvBoolean('OTEL_ENABLED')) return;

	const tags: any = {};

	if (process.env.HOSTNAME) {
		tags.pod = process.env.HOSTNAME;
	}
	if (process.env.OTEL_SERVICE_NAMESPACE) {
		tags.pod = process.env.service_namespace;
	}
	let appName = process.env.OTEL_SERVICE_NAME || 'unknown';
	const attributes = newResource().attributes;
	for (const key in attributes) {
		let k: string;
		switch (key) {
			case 'service.name': {
				appName = attributes[key] as string;
				continue;
			}
			case ATTR_VCS_REF_HEAD_REVISION: {
				k = 'service_git_ref';
				break;
			}
			case ATTR_VCS_REPOSITORY_URL_FULL: {
				k = 'service_repository';
				break;
			}
			case 'vcs_repository_path': {
				k = 'service_root_path';
				break;
			}
			default: {
				k = key.replace('.', '_');
			}
		}
		tags[k] = attributes[key] as string;
	}

	Pyroscope.init({
		appName: appName,
		// Enable CPU time collection for wall profiles
		// This is required for CPU profiling functionality
		wall: {
			collectCpuTime: true,
		},
		tags: tags,
	});

	// handle shutdown
	['SIGINT', 'SIGTERM'].forEach((signal) => {
		process.on(signal, async () => await Pyroscope.stop());
	});

	Pyroscope.start();
};
