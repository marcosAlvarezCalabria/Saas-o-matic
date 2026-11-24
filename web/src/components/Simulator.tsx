import { useState } from 'react';
import { Info, Settings2 } from 'lucide-react';

import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { usePreview } from '../hooks/usePreview';
import { formatVatRate } from '../lib/vatRate';
import { Money } from './Money';
import { SaveSimulation } from './SaveSimulation';
import { UsersSlider } from './UsersSlider';
import { Card, Icon, InlineAlert, NumberField } from './ui';

function parseUsers(value: string): number | null {
  if (value.trim() === '') {
    return null;
  }

  const users = Number(value);
  return Number.isInteger(users) && users >= 1 && users <= 100_000
    ? users
    : null;
}

function parseUsage(value: string): number | null {
  if (value.trim() === '') {
    return 0;
  }

  const usage = Number(value);
  return Number.isSafeInteger(usage) && usage >= 0 ? usage : null;
}

interface SimulatorProps {
  customerId: number;
  onSimulationSaved: () => void;
}

export function Simulator({
  customerId,
  onSimulationSaved,
}: SimulatorProps) {
  const [users, setUsers] = useState('15');
  const [storageGb, setStorageGb] = useState('');
  const [apiCalls, setApiCalls] = useState('');
  const validUsers = parseUsers(users);
  const validStorageGb = parseUsage(storageGb);
  const validApiCalls = parseUsage(apiCalls);
  const debouncedUsers = useDebouncedValue(validUsers, 250);
  const { status, result, rateLimited, retry } = usePreview(
    customerId,
    debouncedUsers,
  );
  const usersError = validUsers === null ? 'Entre 1 y 100 000 usuarios' : undefined;
  const previewStatus =
    result && validUsers !== debouncedUsers ? 'refreshing' : status;

  return (
    <Card>
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Icon className="text-link" icon={Settings2} size={24} />
        <h2 className="text-title-md text-text">Simulador</h2>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <UsersSlider error={usersError} value={users} onChange={setUsers} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <NumberField
            error={
              validStorageGb === null
                ? 'Introduce un entero mayor o igual que 0'
                : undefined
            }
            label="Almacenamiento (GB)"
            min="0"
            name="storageGb"
            placeholder="0"
            suffix="GB"
            value={storageGb}
            onChange={(event) => setStorageGb(event.target.value)}
          />
          <NumberField
            error={
              validApiCalls === null
                ? 'Introduce un entero mayor o igual que 0'
                : undefined
            }
            label="Llamadas a la API / mes"
            min="0"
            name="apiCalls"
            placeholder="0"
            suffix="/ mes"
            value={apiCalls}
            onChange={(event) => setApiCalls(event.target.value)}
          />
        </div>

        <div className="flex items-start gap-3 rounded-field bg-primary-soft p-4 text-sm text-text-muted">
          <Icon className="mt-0.5 shrink-0 text-link" icon={Info} size={20} />
          <p>
            Almacenamiento y llamadas son <strong>informativos</strong>: no
            cambian el precio.
          </p>
        </div>

        {usersError ? null : previewStatus === 'error' ? (
          <InlineAlert
            action={{ label: 'Reintentar', onClick: retry }}
            variant="error"
          >
            {rateLimited
              ? 'Demasiadas peticiones. Espera un momento y vuelve a intentarlo.'
              : 'No se pudo calcular el precio.'}
          </InlineAlert>
        ) : result ? (
          <div
            aria-live="polite"
            className={`rounded-card border border-border bg-primary-soft p-6 transition-opacity duration-150 ${previewStatus === 'refreshing' ? 'opacity-50' : ''}`}
          >
            <div className="flex justify-between gap-4 text-sm font-medium text-text-muted">
              <span>Base</span>
              <span className="text-text">
                <Money cents={result.baseCents} />
              </span>
            </div>
            <div className="mt-3 flex justify-between gap-4 text-sm font-medium text-text-muted">
              <span>IVA ({formatVatRate(result.vatRateBasisPoints)})</span>
              <span className="text-text">
                <Money cents={result.vatCents} />
              </span>
            </div>
            <div className="mt-5 flex items-end justify-between gap-4 border-t border-border pt-5">
              <span className="text-caption uppercase text-text-muted">
                Total mensual
              </span>
              <span className="text-right text-amount-sm text-text lg:text-amount">
                <Money cents={result.totalCents} suffix="/ mes" />
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-card border border-border bg-primary-soft p-6 text-center font-medium text-text-muted">
            Calculando…
          </div>
        )}

        <SaveSimulation
          apiCalls={validApiCalls}
          customerId={customerId}
          storageGb={validStorageGb}
          users={validUsers}
          onSaved={onSimulationSaved}
        />
      </div>
    </Card>
  );
}
