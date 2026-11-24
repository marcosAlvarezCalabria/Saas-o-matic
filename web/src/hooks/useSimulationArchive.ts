import { useRef, useState } from 'react';

import { ApiError } from '../api/apiClient';
import {
  archiveSimulation,
  restoreSimulation,
} from '../api/simulations';
import type { Simulation } from '../api/types';

type ArchiveNotice =
  | {
      variant: 'success';
      message: string;
      undoSimulation?: Simulation;
    }
  | { variant: 'error'; message: string }
  | null;

const RATE_LIMITED_MESSAGE =
  'Demasiadas peticiones. Espera un momento y vuelve a intentarlo.';

export function useSimulationArchive(onChanged: () => void) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [notice, setNotice] = useState<ArchiveNotice>(null);
  const busyRef = useRef<number | null>(null);

  async function archive(simulation: Simulation): Promise<void> {
    if (!begin(simulation.id)) {
      return;
    }

    setNotice(null);
    try {
      const archived = await archiveSimulation(simulation.id);
      setNotice({
        variant: 'success',
        message: 'Simulación archivada.',
        undoSimulation: archived,
      });
      onChanged();
    } catch (error) {
      setNotice({
        variant: 'error',
        message: errorMessage(error, 'archivar'),
      });
    } finally {
      finish();
    }
  }

  async function restore(simulation: Simulation): Promise<void> {
    if (!begin(simulation.id)) {
      return;
    }

    setNotice(null);
    try {
      await restoreSimulation(simulation.id);
      setNotice({ variant: 'success', message: 'Simulación recuperada.' });
      onChanged();
    } catch (error) {
      setNotice({
        variant: 'error',
        message: errorMessage(error, 'recuperar'),
      });
    } finally {
      finish();
    }
  }

  function begin(id: number): boolean {
    if (busyRef.current !== null) {
      return false;
    }

    busyRef.current = id;
    setBusyId(id);
    return true;
  }

  function finish(): void {
    busyRef.current = null;
    setBusyId(null);
  }

  return {
    archive,
    busyId,
    closeNotice: () => setNotice(null),
    notice,
    restore,
  };
}

function errorMessage(error: unknown, operation: 'archivar' | 'recuperar') {
  if (error instanceof ApiError && error.status === 429) {
    return RATE_LIMITED_MESSAGE;
  }

  return `No se pudo ${operation} la simulación. Inténtalo de nuevo.`;
}
