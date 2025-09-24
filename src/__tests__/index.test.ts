import { wait } from '../wait';
import { PROXY_PROTOCOL, Proxy } from '../types/Proxy';

describe('wait', () => {
  it('should wait for specified delay', async () => {
    const start = Date.now();
    await wait(100);
    const end = Date.now();
    
    expect(end - start).toBeGreaterThanOrEqual(90); // Allow some tolerance
  });
});

describe('PROXY_PROTOCOL', () => {
  it('should have correct protocol values', () => {
    expect(PROXY_PROTOCOL.http).toBe('http');
    expect(PROXY_PROTOCOL.https).toBe('https');
    expect(PROXY_PROTOCOL.socks4).toBe('socks4');
    expect(PROXY_PROTOCOL.socks5).toBe('socks5');
    expect(PROXY_PROTOCOL.unknown).toBe('unknown');
  });
});

describe('Proxy type', () => {
  it('should create a valid proxy object', () => {
    const proxy: Proxy = {
      host: 'proxy.example.com',
      port: 8080,
      protocol: PROXY_PROTOCOL.http,
      username: 'user',
      password: 'pass',
    };

    expect(proxy.host).toBe('proxy.example.com');
    expect(proxy.port).toBe(8080);
    expect(proxy.protocol).toBe(PROXY_PROTOCOL.http);
    expect(proxy.username).toBe('user');
    expect(proxy.password).toBe('pass');
  });

  it('should create a proxy without credentials', () => {
    const proxy: Proxy = {
      host: 'proxy.example.com',
      port: 8080,
      protocol: PROXY_PROTOCOL.socks5,
    };

    expect(proxy.host).toBe('proxy.example.com');
    expect(proxy.port).toBe(8080);
    expect(proxy.protocol).toBe(PROXY_PROTOCOL.socks5);
    expect(proxy.username).toBeUndefined();
    expect(proxy.password).toBeUndefined();
  });
});

describe('Module exports', () => {
  it('should export fetchWithProxy function', async () => {
    const { fetchWithProxy } = await import('../fetchWithProxy');
    expect(typeof fetchWithProxy).toBe('function');
  });

  it('should export fetchWithRetry function', async () => {
    const { fetchWithRetry } = await import('../fetchWithRetry');
    expect(typeof fetchWithRetry).toBe('function');
  });

  it('should export wait function', async () => {
    const { wait } = await import('../wait');
    expect(typeof wait).toBe('function');
  });

  it('should export types', async () => {
    const types = await import('../types');
    expect(types.PROXY_PROTOCOL).toBeDefined();
  });
});