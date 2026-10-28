import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';

let server;
let apiClient;
let useAuthStore;
let getAuthConfig;

before(async () => {
  server = await createServer({ configFile: false, server: { middlewareMode: true } });
  ({ default: apiClient } = await server.ssrLoadModule('/src/services/apiClient.ts'));
  ({ useAuthStore } = await server.ssrLoadModule('/src/store/authstore.ts'));
  ({ getAuthConfig } = await server.ssrLoadModule('/src/utils/AuthConfig.ts'));
});

after(async () => {
  await server?.close();
});

test('envía el token actual por un encabezado que Azure no sustituye', () => {
  apiClient.defaults.baseURL = '/api';
  useAuthStore.setState({ isAuthenticated: true, user: { accessToken: 'fresh-token' } });
  assert.deepEqual(getAuthConfig().headers, {
    Authorization: 'Bearer fresh-token',
    'X-Tickets-Authorization': 'Bearer fresh-token',
  });

  useAuthStore.setState({ isAuthenticated: true, user: { accessToken: 'renewed-token' } });
  assert.equal(getAuthConfig().headers['X-Tickets-Authorization'], 'Bearer renewed-token');
});

test('las llamadas directas al backend usan únicamente Authorization', () => {
  useAuthStore.setState({ isAuthenticated: true, user: { accessToken: 'fresh-token' } });
  for (const baseURL of ['https://backend.example.com/api', '//backend.example.com/api']) {
    apiClient.defaults.baseURL = baseURL;
    assert.deepEqual(getAuthConfig().headers, { Authorization: 'Bearer fresh-token' });
  }
});

test('no envía credenciales al cerrar sesión o si falta el token', () => {
  apiClient.defaults.baseURL = '/api';
  useAuthStore.setState({ isAuthenticated: false, user: { accessToken: 'old-token' } });
  assert.deepEqual(getAuthConfig().headers, {});
  useAuthStore.setState({ isAuthenticated: true, user: {} });
  assert.deepEqual(getAuthConfig().headers, {});
});
