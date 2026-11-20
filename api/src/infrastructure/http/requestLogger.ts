import type { RequestHandler } from 'express';

export const requestLogger: RequestHandler = (request, response, next) => {
  response.on('finish', () => {
    console.info(`${request.method} ${request.path} ${response.statusCode}`);
  });

  next();
};
