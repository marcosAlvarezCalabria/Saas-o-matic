import type { ApiErrorCode } from './types';

const DEFAULT_API_URL = 'http://localhost:3000';

const API_ERROR_CODES = new Set<ApiErrorCode>([
  'VALIDATION_ERROR',
  'INVALID_TAX_ID',
  'COUNTRY_NOT_SUPPORTED',
  'TAX_ID_ALREADY_EXISTS',
  'CUSTOMER_NOT_FOUND',
  'SIMULATION_NOT_FOUND',
  'NOT_FOUND',
  'RATE_LIMITED',
  'INTERNAL_ERROR',
  'UNKNOWN',
]);

interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(cause: unknown) {
    super('No se pudo conectar con la API.', { cause });
    this.name = 'NetworkError';
  }
}

function buildUrl(path: string): string {
  const configuredUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
  const baseUrl = `${configuredUrl.replace(/\/+$/, '')}/`;

  return new URL(path.replace(/^\//, ''), baseUrl).toString();
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function parseErrorPayload(payload: unknown): {
  code: ApiErrorCode;
  message: string;
} | null {
  if (typeof payload !== 'object' || payload === null || !('error' in payload)) {
    return null;
  }

  const error = payload.error;
  if (typeof error !== 'object' || error === null) {
    return null;
  }

  const code = 'code' in error ? error.code : null;
  const message = 'message' in error ? error.message : null;
  if (typeof code !== 'string' || typeof message !== 'string') {
    return null;
  }

  return {
    code: API_ERROR_CODES.has(code as ApiErrorCode)
      ? (code as ApiErrorCode)
      : 'UNKNOWN',
    message,
  };
}

export async function request<T>(
  path: string,
  { method = 'GET', body, signal }: RequestOptions = {},
): Promise<T> {
  const init: RequestInit = { method, signal };

  if (body !== undefined) {
    init.headers = { 'Content-Type': 'application/json' };
    init.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path), init);
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }

    throw new NetworkError(error);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    if (!response.ok) {
      throw new ApiError(
        response.status,
        'UNKNOWN',
        response.statusText || 'Error desconocido de la API.',
      );
    }

    throw error;
  }

  if (!response.ok) {
    const apiError = parseErrorPayload(payload);
    throw new ApiError(
      response.status,
      apiError?.code ?? 'UNKNOWN',
      apiError?.message ??
        (response.statusText || 'Error desconocido de la API.'),
    );
  }

  return payload as T;
}
