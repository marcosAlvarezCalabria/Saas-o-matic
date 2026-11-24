import { useCallback, useEffect, useState } from 'react';

import { searchCustomers } from '../api/customers';
import type { Customer } from '../api/types';

export type CustomersStatus = 'pending' | 'loading' | 'error' | 'success';

interface CustomersState {
  search: string;
  attempt: number;
  status: Exclude<CustomersStatus, 'pending'>;
  customers: Customer[];
}

export function useCustomers(search: string) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<CustomersState>({
    search: '',
    attempt: -1,
    status: 'loading',
    customers: [],
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const loadingTimeoutId = window.setTimeout(() => {
      if (active) {
        setState((currentState) => ({
          search,
          attempt,
          status: 'loading',
          customers: currentState.customers,
        }));
      }
    }, 200);

    searchCustomers(search, controller.signal)
      .then((nextCustomers) => {
        if (!active) {
          return;
        }

        window.clearTimeout(loadingTimeoutId);
        setState({
          search,
          attempt,
          status: 'success',
          customers: nextCustomers,
        });
      })
      .catch((error: unknown) => {
        if (!active || (error instanceof Error && error.name === 'AbortError')) {
          return;
        }

        window.clearTimeout(loadingTimeoutId);
        setState((currentState) => ({
          search,
          attempt,
          status: 'error',
          customers: currentState.customers,
        }));
      });

    return () => {
      active = false;
      window.clearTimeout(loadingTimeoutId);
      controller.abort();
    };
  }, [attempt, search]);

  const retry = useCallback(() => {
    setAttempt((currentAttempt) => currentAttempt + 1);
  }, []);

  const status: CustomersStatus =
    state.search === search && state.attempt === attempt
      ? state.status
      : 'pending';

  return { status, customers: state.customers, retry };
}
