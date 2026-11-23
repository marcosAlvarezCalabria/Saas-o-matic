import cors from 'cors';
import express from 'express';

import { errorHandler, notFoundHandler } from './errorHandler.js';
import { createRateLimiters, type RateLimitOptions } from './rateLimits.js';
import { requestLogger } from './requestLogger.js';
import { createCustomerRouter, type CustomerUseCases } from './routes/customers.js';
import { createSimulationRouter, type SimulationUseCases } from './routes/simulations.js';

export interface AppOptions {
  corsOrigins: string[];
  rateLimits?: RateLimitOptions;
  trustProxy: number;
}

export function createApp(useCases: CustomerUseCases & SimulationUseCases, options: AppOptions) {
  const app = express();
  const { generalLimiter, writeLimiter } = createRateLimiters(options.rateLimits);

  app.set('trust proxy', options.trustProxy);

  app.use(requestLogger);
  app.use(
    cors({
      origin: options.corsOrigins,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
    }),
  );

  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  app.use(generalLimiter);
  app.use(express.json());
  app.post('/customers', writeLimiter);
  app.post('/simulations', writeLimiter);
  app.use('/customers', createCustomerRouter(useCases));
  app.use(createSimulationRouter(useCases));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
