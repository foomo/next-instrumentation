import {
	defaultResource,
	resourceFromAttributes,
} from '@opentelemetry/resources';
import {
	ATTR_VCS_REF_BASE_NAME,
	ATTR_VCS_REF_BASE_REVISION,
	ATTR_VCS_REF_BASE_TYPE,
	ATTR_VCS_REF_HEAD_NAME,
	ATTR_VCS_REF_HEAD_REVISION,
	ATTR_VCS_REF_HEAD_TYPE,
	ATTR_VCS_REPOSITORY_NAME,
	ATTR_VCS_REPOSITORY_URL_FULL,
} from '@opentelemetry/semantic-conventions/incubating';

const envAttributesMap: Record<string, string[]> = {
	[ATTR_VCS_REPOSITORY_NAME]: [
		'REPO_NAME',
		'REPOSITORY_NAME',
		'GIT_REPOSITORY_NAME',
		'GITHUB_REPOSITORY_NAME',
		'GIT_OTEL_VCS_REPOSITORY_NAME',
	],
	[ATTR_VCS_REPOSITORY_URL_FULL]: [
		'REPO_URL',
		'REPOSITORY_URL',
		'GIT_REPOSITORY_URL',
		'GITHUB_REPOSITORY',
		'OTEL_VCS_REPOSITORY_URL_FULL',
	],
	[ATTR_VCS_REF_BASE_NAME]: ['OTEL_VCS_BASE_NAME'],
	[ATTR_VCS_REF_BASE_REVISION]: ['OTEL_VCS_BASE_REVSION'],
	[ATTR_VCS_REF_BASE_TYPE]: ['OTEL_VCS_BASE_TYPE'],
	[ATTR_VCS_REF_HEAD_NAME]: ['GIT_BRANCH', 'OTEL_VCS_HEAD_NAME'],
	[ATTR_VCS_REF_HEAD_REVISION]: [
		'GIT_COMMIT',
		'GIT_COMMIT_HASH',
		'OTEL_VCS_HEAD_REVSION',
	],
	[ATTR_VCS_REF_HEAD_TYPE]: ['GIT_TYPE', 'OTEL_VCS_HEAD_TYPE'],
	'vcs.repository.path': [
		'REPO_PATH',
		'REPOSITORY_PATH',
		'GIT_REPOSITORY_PATH',
		'OTEL_VCS_ROOT_PATH',
	],
};

export const envAttributes = () => {
	const attr: Record<string, string> = {};
	for (const key in envAttributesMap) {
		const value = envAttributesMap[key];
		for (const v of value) {
			if (process.env[v]) {
				attr[key] = process.env[v];
			}
		}
	}
	return attr;
};

export const newResource = () => {
	const resource = defaultResource();
	return resource.merge(resourceFromAttributes(envAttributes()));
};
