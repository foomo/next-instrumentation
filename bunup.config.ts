import { defineConfig } from 'bunup'

export default defineConfig([
	{
		name: 'node',
		target: 'node',
		entry: 'src/server/index.ts',
		outDir: 'dist/server',
		format: 'esm',
		sourcemap: 'linked',
	},
	{
		name: 'browser',
		target: 'browser',
		entry: 'src/client/index.ts',
		format: 'esm',
		outDir: 'dist/client',
		sourcemap: 'linked',
	},
])
