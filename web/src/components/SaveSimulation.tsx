import { useId, useRef, useState } from 'react';
import { Save } from 'lucide-react';

import { ApiError } from '../api/apiClient';
import { createSimulation } from '../api/simulations';
import type { Simulation } from '../api/types';
import { isSimulationSaved } from '../lib/duplicates';
import { Button, InlineAlert } from './ui';

interface SaveSimulationProps {
  customerId: number;
  users: number | null;
  storageGb: number | null;
  apiCalls: number | null;
  historyReady: boolean;
  simulations: Simulation[];
  onSaved: () => void;
}

type SaveNotice = 'success' | 'rateLimited' | 'error' | null;

export function SaveSimulation({
  customerId,
  users,
  storageGb,
  apiCalls,
  historyReady,
  simulations,
  onSaved,
}: SaveSimulationProps) {
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<SaveNotice>(null);
  const [savedSimulations, setSavedSimulations] = useState<Simulation[]>([]);
  const savingRef = useRef(false);
  const duplicateMessageId = useId();
  const values =
    users === null || storageGb === null || apiCalls === null
      ? null
      : { users, storageGb, apiCalls };
  const duplicate =
    values !== null &&
    isSimulationSaved(
      savedSimulations.length === 0
        ? simulations
        : [...simulations, ...savedSimulations],
      values,
    );

  async function handleSave() {
    if (
      users === null ||
      storageGb === null ||
      apiCalls === null ||
      savingRef.current
    ) {
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setNotice(null);

    try {
      const createdSimulation = await createSimulation({
        customerId,
        users,
        storageGb,
        apiCalls,
      });
      setSavedSimulations((currentSimulations) => [
        ...currentSimulations,
        createdSimulation,
      ]);
      setNotice('success');
      onSaved();
    } catch (error) {
      const rateLimited =
        error instanceof ApiError &&
        (error.status === 429 || error.code === 'RATE_LIMITED');
      setNotice(rateLimited ? 'rateLimited' : 'error');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-12 flex-col gap-4 lg:flex-row-reverse lg:items-center">
      {notice === 'success' ? (
        <InlineAlert variant="success" onClose={() => setNotice(null)}>
          Simulación guardada
        </InlineAlert>
      ) : notice ? (
        <InlineAlert variant="error">
          {notice === 'rateLimited'
            ? 'Demasiadas peticiones. Espera un momento y vuelve a intentarlo.'
            : 'No se pudo guardar. Inténtalo de nuevo.'}
        </InlineAlert>
      ) : null}

      <Button
        aria-describedby={duplicate ? duplicateMessageId : undefined}
        className="w-full self-end md:w-auto"
        disabled={
          saving ||
          !historyReady ||
          users === null ||
          storageGb === null ||
          apiCalls === null ||
          duplicate
        }
        icon={Save}
        size="lg"
        onClick={handleSave}
      >
        {saving ? 'Guardando…' : 'Guardar simulación'}
      </Button>
      {duplicate ? (
        <p
          className="text-center text-caption text-text-muted md:text-right lg:flex-1 lg:text-left"
          id={duplicateMessageId}
        >
          Ya hay una simulación guardada con estos valores.
        </p>
      ) : null}
    </div>
  );
}
