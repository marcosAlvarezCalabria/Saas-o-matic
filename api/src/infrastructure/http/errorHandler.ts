import type { ErrorRequestHandler, RequestHandler } from 'express';

import { ApplicationError } from '../../application/errors.js';
import { DomainError } from '../../domain/errors.js';

export const notFoundHandler: RequestHandler = (_request, response) => {
  response.status(404).json(errorBody('NOT_FOUND', 'Ruta no encontrada'));
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  void next;

  if (isMalformedJsonError(error)) {
    response.status(400).json(errorBody('VALIDATION_ERROR', 'El cuerpo no es JSON válido'));
    return;
  }

  if (error instanceof DomainError) {
    response.status(400).json(errorBody(error.code, error.message));
    return;
  }

  if (error instanceof ApplicationError) {
    const status = error.code === 'TAX_ID_ALREADY_EXISTS' ? 409 : 404;
    response.status(status).json(errorBody(error.code, error.message));
    return;
  }

  console.error(error);
  response.status(500).json(errorBody('INTERNAL_ERROR', 'Error interno'));
};

export function validationErrorBody(message: string) {
  return errorBody('VALIDATION_ERROR', message);
}

export function errorBody(code: string, message: string) {
  return { error: { code, message } };
}

function isMalformedJsonError(error: unknown): boolean {
  return (
    error instanceof SyntaxError &&
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    error.type === 'entity.parse.failed'
  );
}
