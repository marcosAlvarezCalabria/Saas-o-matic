import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../api/apiClient';
import { previewSimulation } from '../api/simulations';
import type { CostBreakdown } from '../api/types';

export type PreviewStatus = 'loading' | 'refreshing' | 'error' | 'success';

interface PreviewState {
  customerId: number;
  users: number;
  attempt: number;
  status: 'error' | 'success';
  result: CostBreakdown | null;
  error: unknown;
}

function isValidUsers(users: number | null): users is number {
  return (
    users !== null &&
    Number.isInteger(users) &&
    users >= 1 &&
    users <= 100_000
  );
}

export function usePreview(customerId: number, users: number | null) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<PreviewState>({
    customerId: -1,
    users: -1,
    attempt: -1,
    status: 'error',
    result: null,
    error: null,
  });

  useEffect(() => {
    if (!isValidUsers(users)) {
      return;
    }

    const controller = new AbortController();
    let active = true;

    previewSimulation({ customerId, users }, controller.signal)
      .then((result) => {
        if (active) {
          setState({
            customerId,
            users,
            attempt,
            status: 'success',
            result,
            error: null,
          });
        }
      })
      .catch((error: unknown) => {
        if (!active || (error instanceof Error && error.name === 'AbortError')) {
          return;
        }

        setState((currentState) => ({
          customerId,
          users,
          attempt,
          status: 'error',
          result: currentState.result,
          error,
        }));
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt, customerId, users]);

  const retry = useCallback(() => {
    setAttempt((currentAttempt) => currentAttempt + 1);
  }, []);

  const isCurrent =
    isValidUsers(users) &&
    state.customerId === customerId &&
    state.users === users &&
    state.attempt === attempt;
  const status: PreviewStatus = isCurrent
    ? state.status
    : state.result
      ? 'refreshing'
      : 'loading';

  const rateLimited =
    state.error instanceof ApiError &&
    (state.error.status === 429 || state.error.code === 'RATE_LIMITED');

  return { status, result: state.result, rateLimited, retry };
}
