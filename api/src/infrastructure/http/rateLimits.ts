import type { RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';

import { errorBody } from './errorHandler.js';

export interface RateLimitOptions {
  windowMs?: number;
  writeLimit?: number;
  generalLimit?: number;
}

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_WRITE_LIMIT = 30;
const DEFAULT_GENERAL_LIMIT = 120;
const RATE_LIMIT_MESSAGE = 'Demasiadas peticiones. Espera un momento y vuelve a intentarlo.';

export function createRateLimiters(options: RateLimitOptions = {}) {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const handler: RequestHandler = (_request, response) => {
    response.status(429).json(errorBody('RATE_LIMITED', RATE_LIMIT_MESSAGE));
  };

  return {
    generalLimiter: rateLimit({
      windowMs,
      limit: options.generalLimit ?? DEFAULT_GENERAL_LIMIT,
      standardHeaders: true,
      legacyHeaders: false,
      handler,
    }),
    writeLimiter: rateLimit({
      windowMs,
      limit: options.writeLimit ?? DEFAULT_WRITE_LIMIT,
      standardHeaders: true,
      legacyHeaders: false,
      handler,
    }),
  };
}
