![npm](https://img.shields.io/npm/dm/@foomo/next-instrumentation.svg?style=flat-square)
![npm](https://img.shields.io/npm/l/@foomo/next-instrumentation.svg?style=flat-square)
[![Build Status](https://github.com/foomo/next-instrumentation/actions/workflows/test.yml/badge.svg?branch=main&event=push)](https://github.com/foomo/next-instrumentation/actions/workflows/test.yml)

# @foomo/next-instrumentation

Opinionated Next.js instrumentation library.

## Installation

```bash
npm install -S @foomo/next-instrumentation
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

Add the `@bestbytes/next-instrumentation` package to your `dependencies`:

```json5
// package.json
{
	"dependencies": {
		"@foomo/next-instrumentation": "latest"
	}
}
```

Create a `instrumentation.ts` file in your nextjs source directory:

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

Contributions are welcome! Please fork the repository and submit a pull request.

## License

Distributed under MIT License, please see license file within the code for more details.

_Made with ♥ [foomo](https://www.foomo.org) by [bestbytes](https://www.bestbytes.com)_
