import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError, NetworkError, request } from './apiClient';
import { searchCustomers } from './customers';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('apiClient', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('returns JSON from a successful response', async () => {
    const payload = { id: 1, companyName: 'Acme' };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(payload)));

    await expect(request('/customers/1')).resolves.toEqual(payload);
  });

  it('turns an API error response into ApiError', async () => {
    const response = jsonResponse(
      {
        error: {
          code: 'CUSTOMER_NOT_FOUND',
          message: 'Cliente no encontrado',
        },
      },
      404,
    );
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

    const error = await request('/customers/999').catch(
      (reason: unknown) => reason,
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 404,
      code: 'CUSTOMER_NOT_FOUND',
      message: 'Cliente no encontrado',
    });
  });

  it('uses UNKNOWN when an error response is not JSON', async () => {
    const response = new Response('Server error', { status: 500 });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

    const error = await request('/customers').catch(
      (reason: unknown) => reason,
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 500, code: 'UNKNOWN' });
  });

  it('turns a fetch TypeError into NetworkError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    );

    await expect(request('/customers')).rejects.toBeInstanceOf(NetworkError);
  });

  it('rethrows an aborted request unchanged', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError));

    await expect(request('/customers')).rejects.toBe(abortError);
  });

  it('uses VITE_API_URL and encodes the search query', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([]));
    vi.stubGlobal('fetch', fetchMock);

    await searchCustomers('a&b');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/customers?search=a%26b',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
