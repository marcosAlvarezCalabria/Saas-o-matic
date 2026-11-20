import type { RequestHandler } from 'express';

export const requestLogger: RequestHandler = (request, response, next) => {
  response.on('finish', () => {
    const path = request.originalUrl.split('?', 1)[0] ?? request.originalUrl;
    console.info(`${request.method} ${path} ${response.statusCode}`);
  });

  next();
};
