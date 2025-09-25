# fetch-with-proxy3

[![npm version](https://badge.fury.io/js/fetch-with-proxy3.svg)](https://badge.fury.io/js/fetch-with-proxy3)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A robust, TypeScript-first HTTP client built on top of Axios with comprehensive proxy support and automatic retry logic. Designed for reliable network operations in unstable environments.

## Features

- 🔄 **Automatic Retry Logic**: Configurable retry attempts with customizable delays
- 🌐 **Comprehensive Proxy Support**: HTTP, HTTPS, SOCKS4, and SOCKS5 proxies
- 🔒 **Type-Safe**: Full TypeScript support with comprehensive type definitions
- ⚡ **Modern**: Uses AbortController for request cancellation (no deprecated APIs)
- 🛡️ **Reliable**: Built-in error handling and timeout management
- 📦 **Zero Config**: Works out of the box with sensible defaults
- 🎯 **Flexible**: Highly configurable for various use cases

## Installation

```bash
npm install fetch-with-proxy3
```

```bash
yarn add fetch-with-proxy3
```

```bash
pnpm add fetch-with-proxy3
```

## Quick Start

### Basic Usage (No Proxy)

```typescript
import { fetchWithProxy } from 'fetch-with-proxy3';

const response = await fetchWithProxy('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your-token'
  }
});

if (response.ok) {
  console.log('Success:', response.data);
} else {
  console.error('Error:', response.error);
}
```

### With HTTP/HTTPS Proxy

```typescript
import { fetchWithProxy, PROXY_PROTOCOL } from 'fetch-with-proxy3';

const proxies = [{
  host: 'proxy.example.com',
  port: 8080,
  protocol: PROXY_PROTOCOL.http,
  username: 'your-username', // optional
  password: 'your-password'  // optional
}];

const response = await fetchWithProxy(
  'https://api.example.com/data',
  {
    method: 'POST',
    data: { key: 'value' },
    headers: { 'Content-Type': 'application/json' }
  },
  proxies,
  3,     // retry attempts
  1500,  // delay between retries (ms)
  30000  // timeout (ms)
);
```

### With SOCKS Proxy

```typescript
import { fetchWithProxy, PROXY_PROTOCOL } from 'fetch-with-proxy3';

const socksProxy = [{
  host: 'socks-proxy.example.com',
  port: 1080,
  protocol: PROXY_PROTOCOL.socks5,
  username: 'user',
  password: 'pass'
}];

const response = await fetchWithProxy(
  'https://api.example.com/secure-endpoint',
  { method: 'GET' },
  socksProxy
);
```

### Multiple Proxies (Failover)

```typescript
import { fetchWithProxy, PROXY_PROTOCOL } from 'fetch-with-proxy3';

const proxies = [
  {
    host: 'primary-proxy.com',
    port: 8080,
    protocol: PROXY_PROTOCOL.http
  },
  {
    host: 'backup-proxy.com',
    port: 3128,
    protocol: PROXY_PROTOCOL.https
  },
  {
    host: 'socks-proxy.com',
    port: 1080,
    protocol: PROXY_PROTOCOL.socks5
  }
];

// Will try each proxy in order until one succeeds
const response = await fetchWithProxy(
  'https://api.example.com/data',
  { method: 'GET' },
  proxies
);
```

## API Reference

### fetchWithProxy

```typescript
function fetchWithProxy<T = any, D = any>(
  url: string,
  options?: AxiosRequestConfig<D>,
  proxies?: Proxy[],
  attempts?: number,
  delay?: number,
  timeout?: number
): Promise<AxiosResponse<T> & { ok: boolean; error?: Error }>
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | `string` | - | The URL to request |
| `options` | `AxiosRequestConfig<D>` | `{}` | Axios request configuration |
| `proxies` | `Proxy[]` | `[]` | Array of proxy configurations |
| `attempts` | `number` | `3` | Number of retry attempts |
| `delay` | `number` | `1500` | Delay between retries (milliseconds) |
| `timeout` | `number` | `30000` | Request timeout (milliseconds) |

#### Returns

Promise resolving to an enhanced Axios response with:
- `ok`: Boolean indicating success (status 200-299)
- `error`: Error object if request failed
- All standard Axios response properties

### fetchWithRetry

```typescript
function fetchWithRetry<T = any, D = any>(
  url: string,
  options?: AxiosRequestConfig<D>,
  attempts?: number,
  delay?: number,
  timeout?: number
): Promise<AxiosResponse<T> & { ok: boolean; error?: Error }>
```

Direct retry functionality without proxy support.

### Proxy Configuration

```typescript
interface Proxy {
  host: string;
  port: number;
  protocol: PROXY_PROTOCOL;
  username?: string;
  password?: string;
}

enum PROXY_PROTOCOL {
  http = "http",
  https = "https",
  socks4 = "socks4",
  socks5 = "socks5",
  unknown = "unknown"
}
```

## Error Handling

The library provides comprehensive error handling:

```typescript
const response = await fetchWithProxy('https://api.example.com/data');

if (response.ok) {
  // Success - status code 200-299
  console.log(response.data);
} else {
  // Handle different error scenarios
  if (response.status === 404) {
    console.log('Resource not found');
  } else if (response.error) {
    console.error('Request failed:', response.error.message);
  }
}
```

## Advanced Configuration

### Custom Timeout and Retries

```typescript
const response = await fetchWithProxy(
  'https://slow-api.example.com/data',
  { method: 'GET' },
  [], // no proxies
  5,     // 5 retry attempts
  2000,  // 2 second delay between retries
  60000  // 60 second timeout
);
```

### Request Interceptors

Since this library is built on Axios, you can use Axios interceptors:

```typescript
import axios from 'axios';

// Add request interceptor
axios.interceptors.request.use(config => {
  config.headers['X-Custom-Header'] = 'value';
  return config;
});

// Then use fetchWithProxy normally
const response = await fetchWithProxy('https://api.example.com/data');
```

## TypeScript Support

Full TypeScript support with generic types:

```typescript
interface ApiResponse {
  id: number;
  name: string;
  email: string;
}

interface RequestPayload {
  name: string;
  email: string;
}

const response = await fetchWithProxy<ApiResponse, RequestPayload>(
  'https://api.example.com/users',
  {
    method: 'POST',
    data: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  }
);

// response.data is now typed as ApiResponse
console.log(response.data.name); // TypeScript knows this is a string
```

## Testing

The library includes comprehensive tests. Run them with:

```bash
npm test
```

For coverage report:

```bash
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.4
- Updated lint-staged to latest version (16.2.1)
- Applied consistent code formatting with double quotes
- Maintained 100% type safety and test coverage
- Zero security vulnerabilities
- Professional code quality assurance

### v1.0.3
- Updated all dependencies to latest versions
- Replaced deprecated CancelToken with AbortController
- Improved TypeScript type safety
- Enhanced error handling
- Added comprehensive test suite
- Updated documentation

### v1.0.2
- Initial stable release with proxy support

## Support

- 📧 Email: dmitrii.selikhov@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/idimetrix/fetch-with-proxy/issues)
- 💼 LinkedIn: [Dmitrii Selikhov](https://www.linkedin.com/in/dimetrix)

---

Made with ❤️ by [Dmitrii Selikhov](https://github.com/idimetrix)