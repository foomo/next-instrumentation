![npm](https://img.shields.io/npm/dm/@foomo/next-instrumentation.svg?style=flat-square)
![npm](https://img.shields.io/npm/l/@foomo/next-instrumentation.svg?style=flat-square)
[![Build Status](https://github.com/foomo/next-instrumentation/actions/workflows/test.yml/badge.svg?branch=main&event=push)](https://github.com/foomo/next-instrumentation/actions/workflows/test.yml)

# @foomo/next-instrumentation

Opinionated Next.js instrumentation library.

## Installation

```bash
# npm
npm install @foomo/next-instrumentation
# yarn
yarn add @foomo/next-instrumentation
# pnpm
pnpm install -S @foomo/next-instrumentation
# bun
bun add @foomo/next-instrumentation
```

## Usage

Copy the `patches/next.patch` file to your project and use your package manager to apply it.

#### PNPM

```json5
// package.json
{
	"pnpm": {
		"patchedDependencies": {
			"next": "path/to/next.patch"
		}
	}
}
```

Create a `instrumentation.ts` file in your `src` directory:

```typescript
// instrumentation.ts
export async function register() {
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		// load dependencies
		await require('pino');
		await require('next-logger');
		// register instrumentation
		await (await import('@foomo/next-instrumentation/server')).register();
	}
}
```

Init faro on your pages:

```tsx
// src/app/page.tsx
import { useFaro } from '@foomo/next-instrumentation/client';

export default async function Page({ params }: { params: {} }) {
	useFaro({
		url: "https://faro.example.com/collect",
		app: {
			name: "your-app",
		},
	})

	return (</>)
}
```

## Contributing

Contributions are welcome! Please read the [contributing guide](CONTRIBUTING.md).

![Contributors](https://contributors-table.vercel.app/image?repo=foomo/next-instrumentation&width=50&columns=15)

## License

Distributed under MIT License, please read the [license file](LICENSE) for more details.

_Made with ♥ [foomo](https://www.foomo.org) by [bestbytes](https://www.bestbytes.com)_
