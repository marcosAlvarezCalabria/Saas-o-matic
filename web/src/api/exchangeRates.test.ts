import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchExchangeRates } from './exchangeRates';

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchExchangeRates', () => {
  it('returns rates and their update date from a successful response', async () => {
    const rates = { EUR: 1, USD: 1.09 };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          result: 'success',
          rates,
          time_last_update_utc: 'Sun, 22 Nov 2026 00:00:01 +0000',
        }),
      ),
    );

    await expect(fetchExchangeRates()).resolves.toEqual({
      rates,
      updatedAt: 'Sun, 22 Nov 2026 00:00:01 +0000',
    });
  });

  it.each([
    ['an unsuccessful result', jsonResponse({ result: 'error', rates: {} })],
    ['missing rates', jsonResponse({ result: 'success' })],
    ['invalid JSON', new Response('not JSON')],
  ])('rejects %s', async (_case, response) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

    await expect(fetchExchangeRates()).rejects.toThrow();
  });
});
