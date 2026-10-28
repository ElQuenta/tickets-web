import azureFunctions from '@azure/functions';
import { proxyRequest } from './proxy.js';

const { app } = azureFunctions;

app.http('backendProxy', {
  route: '{*path}',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  authLevel: 'anonymous',
  handler: proxyRequest,
});
