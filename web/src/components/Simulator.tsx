import { useState } from 'react';
import { Settings2 } from 'lucide-react';

import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { usePreview } from '../hooks/usePreview';
import type { Simulation } from '../api/types';
import { PriceSummary } from './PriceSummary';
import { SaveSimulation } from './SaveSimulation';
import { UsersSlider } from './UsersSlider';
import { Card, Icon, InfoTip, NumberField } from './ui';

const USAGE_INFO =
  'Informativo: no cambia el precio. El precio solo depende del número de usuarios.';
const STORAGE_INFO_ID = 'storage-gb-info';
const API_CALLS_INFO_ID = 'api-calls-info';

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
  historyReady: boolean;
  simulations: Simulation[];
  onSimulationSaved: () => void;
}

export function Simulator({
  customerId,
  historyReady,
  simulations,
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
    <Card padding="compact">
      <div className="flex items-center gap-3 border-b border-border pb-4 lg:pb-2">
        <Icon className="text-link" icon={Settings2} size={24} />
        <h2 className="text-title-md text-text">Simulador</h2>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:mt-4 lg:gap-4">
        <UsersSlider error={usersError} value={users} onChange={setUsers} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <NumberField
            aria-describedby={STORAGE_INFO_ID}
            error={
              validStorageGb === null
                ? 'Introduce un entero mayor o igual que 0'
                : undefined
            }
            label="Almacenamiento (GB)"
            labelAction={<InfoTip id={STORAGE_INFO_ID}>{USAGE_INFO}</InfoTip>}
            min="0"
            name="storageGb"
            placeholder="0"
            suffix="GB"
            value={storageGb}
            onChange={(event) => setStorageGb(event.target.value)}
          />
          <NumberField
            aria-describedby={API_CALLS_INFO_ID}
            error={
              validApiCalls === null
                ? 'Introduce un entero mayor o igual que 0'
                : undefined
            }
            label="Llamadas a la API / mes"
            labelAction={<InfoTip id={API_CALLS_INFO_ID}>{USAGE_INFO}</InfoTip>}
            min="0"
            name="apiCalls"
            placeholder="0"
            suffix="/ mes"
            value={apiCalls}
            onChange={(event) => setApiCalls(event.target.value)}
          />
        </div>

        {usersError ? null : (
          <PriceSummary
            rateLimited={rateLimited}
            result={result}
            status={previewStatus}
            onRetry={retry}
          />
        )}

        <SaveSimulation
          apiCalls={validApiCalls}
          customerId={customerId}
          historyReady={historyReady}
          simulations={simulations}
          storageGb={validStorageGb}
          users={validUsers}
          onSaved={onSimulationSaved}
        />
      </div>
    </Card>
  );
}
