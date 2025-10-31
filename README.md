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



Create a `instrumentation.ts` file in your project root and past the following code:

```typescript
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

## Configuration

The `DevProxyConfig` type defines the following options:

```typescript
export type DevProxyConfig = {
  debug?: boolean; // Enable debug logging
  disable?: boolean; // Disable the proxy entirely
  remoteUrl: string | ((request: NextRequest) => string); // Remote URL or function to generate it
  allowResponseCompression?: boolean; // Allow response compression (default: false)
  overrideHostHeader?: boolean; // Override host header (default: true)
  overrideCookieDomain?: false | string; // Domain to use for cookies or false to disable
  basicAuth?: {
    authHeader: string; // Authorization header value
  };
  cfTokenAuth?: {
    clientId: string;
    clientSecret: string;
  };
};
```

## Example

Here's an example of how to use the middleware in your `middleware.ts` file:

```typescript
import {
  createProxyMiddleware,
  DevProxyConfig,
} from "@foomo/next-instrumentation";

const proxyConfig: DevProxyConfig = {
  remoteUrl: "https://api.example.com",
  basicAuth: {
    authHeader: "Basic abc123==",
  },
  overrideCookieDomain: "example.com",
};

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.match("^/(api|webhooks)/")) {
    return proxyMiddleware(request);
  }
  return request;
}

export const config = {
  matcher: ["/api/:path*"],
};

const proxyMiddleware = createProxyMiddleware(proxyConfig);
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

Distributed under MIT License, please see license file within the code for more details.

_Made with ♥ [foomo](https://www.foomo.org) by [bestbytes](https://www.bestbytes.com)_
