import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../api/apiClient';
import { getCustomer } from '../api/customers';
import type { Customer } from '../api/types';

export type CustomerStatus = 'loading' | 'success' | 'notFound' | 'error';

interface CustomerState {
  id: number;
  attempt: number;
  status: Exclude<CustomerStatus, 'loading'>;
  customer: Customer | null;
}

export function useCustomer(id: number | null) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<CustomerState>({
    id: -1,
    attempt: -1,
    status: 'error',
    customer: null,
  });

  useEffect(() => {
    if (id === null) {
      return;
    }

    const controller = new AbortController();
    let active = true;

    getCustomer(id, controller.signal)
      .then((customer) => {
        if (active) {
          setState({ id, attempt, status: 'success', customer });
        }
      })
      .catch((error: unknown) => {
        if (!active || (error instanceof Error && error.name === 'AbortError')) {
          return;
        }

        const notFound =
          error instanceof ApiError && (error.status === 400 || error.status === 404);
        setState({
          id,
          attempt,
          status: notFound ? 'notFound' : 'error',
          customer: null,
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt, id]);

  const retry = useCallback(() => {
    setAttempt((currentAttempt) => currentAttempt + 1);
  }, []);

  const status: CustomerStatus =
    id === null
      ? 'notFound'
      : state.id === id && state.attempt === attempt
        ? state.status
        : 'loading';

  return { status, customer: state.customer, retry };
}
