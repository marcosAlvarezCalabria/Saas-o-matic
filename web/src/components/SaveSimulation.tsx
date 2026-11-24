import { useRef, useState } from 'react';
import { Save } from 'lucide-react';

import { ApiError } from '../api/apiClient';
import { createSimulation } from '../api/simulations';
import { Button, InlineAlert } from './ui';

interface SaveSimulationProps {
  customerId: number;
  users: number | null;
  storageGb: number | null;
  apiCalls: number | null;
  onSaved: () => void;
}

type SaveNotice = 'success' | 'rateLimited' | 'error' | null;

export function SaveSimulation({
  customerId,
  users,
  storageGb,
  apiCalls,
  onSaved,
}: SaveSimulationProps) {
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<SaveNotice>(null);
  const savingRef = useRef(false);

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
      await createSimulation({
        customerId,
        users,
        storageGb,
        apiCalls,
      });
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
    <div className="flex min-h-12 flex-col gap-4">
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
        className="w-full self-end md:w-auto"
        disabled={
          saving || users === null || storageGb === null || apiCalls === null
        }
        icon={Save}
        size="lg"
        onClick={handleSave}
      >
        {saving ? 'Guardando…' : 'Guardar simulación'}
      </Button>
    </div>
  );
}
