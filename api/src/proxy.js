const hopByHopHeaders = [
  'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization',
  'te', 'trailer', 'transfer-encoding', 'upgrade',
];

function responseHeaders(upstream) {
  const headers = new Headers(upstream.headers);
  const connectionHeaders = (headers.get('connection') || '').split(',').map((name) => name.trim());
  for (const name of [...hopByHopHeaders, ...connectionHeaders, 'content-length', 'content-encoding']) {
    if (name) headers.delete(name);
  }
  // fetch descomprime el body; el runtime calcula su longitud al responder.
  headers.set('cache-control', 'no-store');
  return headers;
}

export async function proxyRequest(request, context) {
  const incomingUrl = new URL(request.url);
  let target;

  try {
    const configuredTarget = process.env.API_PROXY_TARGET?.trim();
    if (!configuredTarget) throw new Error('Falta API_PROXY_TARGET');
    target = new URL(configuredTarget);
    if (!['http:', 'https:'].includes(target.protocol) || target.username || target.password || target.search || target.hash) {
      throw new Error('API_PROXY_TARGET debe ser un origen HTTP(S) sin credenciales, query ni fragmento');
    }
    if (target.origin === incomingUrl.origin) throw new Error('API_PROXY_TARGET apunta al propio frontend');
  } catch (error) {
    context.error('Configuración del proxy inválida:', error.message);
    return {
      status: 503,
      headers: { 'cache-control': 'no-store' },
      jsonBody: { message: 'Configura API_PROXY_TARGET con el origen del backend en Azure Static Web Apps.' },
    };
  }

  // Asignar pathname/search conserva /api y evita que la ruta cambie el host destino.
  const backendUrl = new URL(target.origin);
  backendUrl.pathname = incomingUrl.pathname;
  backendUrl.search = incomingUrl.search;
  const headers = new Headers();
  for (const name of ['accept', 'authorization', 'content-type', 'if-none-match', 'if-modified-since']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  try {
    const upstream = await fetch(backendUrl, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer(),
      redirect: 'manual',
      signal: AbortSignal.timeout(30_000),
    });
    const forwardedHeaders = responseHeaders(upstream);
    const location = forwardedHeaders.get('location');
    if (location) {
      const redirectUrl = new URL(location, backendUrl);
      if (redirectUrl.origin === backendUrl.origin) {
        forwardedHeaders.set('location', `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`);
      }
    }

    return {
      status: upstream.status,
      headers: forwardedHeaders,
      body: request.method === 'HEAD' || [204, 205, 304].includes(upstream.status)
        ? undefined
        : new Uint8Array(await upstream.arrayBuffer()),
    };
  } catch (error) {
    const timedOut = error.name === 'TimeoutError' || error.name === 'AbortError';
    context.error('No se pudo conectar al backend:', error.name);
    return {
      status: timedOut ? 504 : 502,
      headers: { 'cache-control': 'no-store' },
      jsonBody: { message: timedOut ? 'El backend tardó demasiado en responder.' : 'No se pudo conectar al backend.' },
    };
  }
}
