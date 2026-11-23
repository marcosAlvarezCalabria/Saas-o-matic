const EXCHANGE_RATES_URL = 'https://open.er-api.com/v6/latest/EUR';

export interface ExchangeRates {
  rates: Record<string, number>;
  updatedAt: string;
}

function isRates(value: unknown): value is Record<string, number> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every((rate) => typeof rate === 'number')
  );
}

export async function fetchExchangeRates(
  signal?: AbortSignal,
): Promise<ExchangeRates> {
  const response = await fetch(EXCHANGE_RATES_URL, { signal });
  if (!response.ok) {
    throw new Error('No se pudieron cargar los tipos de cambio.');
  }

  const payload: unknown = await response.json();
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Respuesta de tipos de cambio no válida.');
  }

  const result = 'result' in payload ? payload.result : null;
  const rates = 'rates' in payload ? payload.rates : null;
  const updatedAt =
    'time_last_update_utc' in payload ? payload.time_last_update_utc : null;

  if (
    result !== 'success' ||
    !isRates(rates) ||
    typeof updatedAt !== 'string'
  ) {
    throw new Error('Respuesta de tipos de cambio no válida.');
  }

  return { rates, updatedAt };
}
