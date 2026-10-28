import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { gzipSync } from 'node:zlib';
import { after, before, test } from 'node:test';
import azureFunctions from '@azure/functions';
import { proxyRequest } from '../src/proxy.js';

const { HttpRequest, HttpResponse } = azureFunctions;

let backend;
let backendOrigin;
const previousTarget = process.env.API_PROXY_TARGET;
const context = { error() {} };

before(async () => {
  backend = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    if (request.url === '/api/compressed') {
      response.setHeader('content-encoding', 'gzip');
      response.end(gzipSync('respuesta comprimida'));
      return;
    }
    if (request.url === '/api/redirect') {
      response.writeHead(307, { location: `${backendOrigin}/api/tickets?page=2` });
      response.end();
      return;
    }
    if (request.url === '/api/empty') {
      response.writeHead(204);
      response.end();
      return;
    }
    const status = /^\/api\/status\/(\d+)$/.exec(request.url)?.[1];
    response.writeHead(status ? Number(status) : 200, { 'content-type': 'application/json', 'www-authenticate': 'Bearer' });
    response.end(JSON.stringify({
      url: request.url,
      method: request.method,
      authorization: request.headers.authorization,
      contentType: request.headers['content-type'],
      host: request.headers.host,
      body: Buffer.concat(chunks).toString(),
    }));
  });
  backend.listen(0, '127.0.0.1');
  await once(backend, 'listening');
  backendOrigin = `http://127.0.0.1:${backend.address().port}`;
});

after(async () => {
  if (previousTarget === undefined) delete process.env.API_PROXY_TARGET;
  else process.env.API_PROXY_TARGET = previousTarget;
  backend.closeAllConnections();
  await new Promise((resolve) => backend.close(resolve));
});

async function invoke(path, init = {}) {
  const request = new HttpRequest({ url: `https://frontend.example.com${path}`, method: 'GET', ...init });
  return new HttpResponse(await proxyRequest(request, context));
}

test('conserva /api y query y cambia el host por el backend', async () => {
  process.env.API_PROXY_TARGET = `${backendOrigin}/`;
  const response = await invoke('/api/tickets?page=2&search=a%2Fb');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.url, '/api/tickets?page=2&search=a%2Fb');
  assert.equal(body.host, new URL(backendOrigin).host);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('reenvía login, JWT y cuerpos de POST, PUT, PATCH y DELETE sin cambios', async () => {
  process.env.API_PROXY_TARGET = backendOrigin;
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
    const payload = JSON.stringify({ email: 'test@example.com', description: 'con acentos: á' });
    const response = await invoke('/api/auth/login?useCookies=false', {
      method,
      headers: { authorization: 'Bearer test-token', 'content-type': 'application/json' },
      body: { string: payload },
    });
    const body = await response.json();
    assert.equal(body.method, method);
    assert.equal(body.url, '/api/auth/login?useCookies=false');
    assert.equal(body.authorization, 'Bearer test-token');
    assert.equal(body.contentType, 'application/json');
    assert.equal(body.body, payload);
  }
});

test('conserva los errores HTTP y encabezados de autenticación del backend', async () => {
  process.env.API_PROXY_TARGET = backendOrigin;
  for (const status of [400, 401, 403, 404, 500]) {
    const response = await invoke(`/api/status/${status}`);
    assert.equal(response.status, status);
    assert.equal(response.headers.get('www-authenticate'), 'Bearer');
    assert.equal((await response.json()).url, `/api/status/${status}`);
  }
});

test('maneja respuestas comprimidas, HEAD, OPTIONS y 204', async () => {
  process.env.API_PROXY_TARGET = backendOrigin;
  const compressed = await invoke('/api/compressed');
  assert.equal(await compressed.text(), 'respuesta comprimida');
  assert.equal(compressed.headers.get('content-encoding'), null);
  assert.equal(compressed.headers.get('content-length'), null);
  assert.equal(await (await invoke('/api/tickets', { method: 'HEAD' })).text(), '');
  assert.equal((await (await invoke('/api/tickets', { method: 'OPTIONS' })).json()).method, 'OPTIONS');
  const empty = await invoke('/api/empty');
  assert.equal(empty.status, 204);
  assert.equal(await empty.text(), '');
});

test('mantiene los redirects del backend dentro de /api del frontend', async () => {
  process.env.API_PROXY_TARGET = backendOrigin;
  const response = await invoke('/api/redirect');
  assert.equal(response.status, 307);
  assert.equal(response.headers.get('location'), '/api/tickets?page=2');
});

test('lee cambios de API_PROXY_TARGET en runtime y rechaza configuración inválida', async () => {
  for (const target of ['', 'no-es-url', 'ftp://backend.example.com', 'https://user:password@backend.example.com', 'https://frontend.example.com']) {
    process.env.API_PROXY_TARGET = target;
    const response = await invoke('/api/tickets');
    assert.equal(response.status, 503);
    assert.match((await response.json()).message, /API_PROXY_TARGET/);
  }
  process.env.API_PROXY_TARGET = backendOrigin;
  assert.equal((await invoke('/api/tickets')).status, 200);
});

test('devuelve 502 si no puede conectar y 504 si vence el timeout', async (t) => {
  process.env.API_PROXY_TARGET = backendOrigin;
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('fetch failed'); });
  assert.equal((await invoke('/api/tickets')).status, 502);
  fetchMock.mock.mockImplementation(async () => { throw new DOMException('timeout', 'TimeoutError'); });
  assert.equal((await invoke('/api/tickets')).status, 504);
});
