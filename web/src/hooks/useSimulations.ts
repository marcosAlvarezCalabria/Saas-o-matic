import { useCallback, useEffect, useState } from 'react';

import { listSimulations } from '../api/simulations';
import type { Simulation } from '../api/types';

export type SimulationsStatus = 'loading' | 'success' | 'error';

interface SimulationsState {
  customerId: number;
  archived: boolean;
  attempt: number;
  status: Exclude<SimulationsStatus, 'loading'>;
  simulations: Simulation[];
}

export function useSimulations(customerId: number | null, archived = false) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<SimulationsState>({
    customerId: -1,
    archived: false,
    attempt: -1,
    status: 'error',
    simulations: [],
  });

  useEffect(() => {
    if (customerId === null) {
      return;
    }

    const controller = new AbortController();
    let active = true;

    listSimulations(customerId, { archived }, controller.signal)
      .then((simulations) => {
        if (active) {
          setState({
            customerId,
            archived,
            attempt,
            status: 'success',
            simulations,
          });
        }
      })
      .catch((error: unknown) => {
        if (!active || (error instanceof Error && error.name === 'AbortError')) {
          return;
        }

        setState((currentState) => ({
          customerId,
          archived,
          attempt,
          status: 'error',
          simulations: currentState.simulations,
        }));
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [archived, attempt, customerId]);

  const reload = useCallback(() => {
    setAttempt((currentAttempt) => currentAttempt + 1);
  }, []);

  const status: SimulationsStatus =
    customerId !== null &&
    state.customerId === customerId &&
    state.archived === archived &&
    state.attempt === attempt
      ? state.status
      : 'loading';

  const simulations =
    state.customerId === customerId && state.archived === archived
      ? state.simulations
      : [];

  return { status, simulations, reload };
}
