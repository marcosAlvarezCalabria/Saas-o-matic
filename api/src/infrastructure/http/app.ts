import express from 'express';

import { errorHandler, notFoundHandler } from './errorHandler.js';
import { requestLogger } from './requestLogger.js';
import { createCustomerRouter, type CustomerUseCases } from './routes/customers.js';

export function createApp(useCases: CustomerUseCases) {
  const app = express();

  app.use(requestLogger);
  app.use(express.json());

  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  app.use('/customers', createCustomerRouter(useCases));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
