import { useCallback, useEffect, useState } from 'react';

import { fetchExchangeRates } from '../api/exchangeRates';

export type ExchangeRatesStatus = 'loading' | 'error' | 'success';

interface ExchangeRatesState {
  status: ExchangeRatesStatus;
  rates: Record<string, number> | null;
  updatedAt: string | null;
}

const INITIAL_STATE: ExchangeRatesState = {
  status: 'loading',
  rates: null,
  updatedAt: null,
};

export function useExchangeRates() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<ExchangeRatesState>(INITIAL_STATE);

  useEffect(() => {
    const controller = new AbortController();

    fetchExchangeRates(controller.signal)
      .then(({ rates, updatedAt }) => {
        setState({ status: 'success', rates, updatedAt });
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        setState({ status: 'error', rates: null, updatedAt: null });
      });

    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => {
    setState(INITIAL_STATE);
    setAttempt((currentAttempt) => currentAttempt + 1);
  }, []);

  return { ...state, retry };
}
