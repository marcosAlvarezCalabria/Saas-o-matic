import { FolderOpen, History } from 'lucide-react';

import type { Simulation } from '../api/types';
import type { SimulationsStatus } from '../hooks/useSimulations';
import { SimulationHistoryCards } from './SimulationHistoryCards';
import { SimulationHistoryTable } from './SimulationHistoryTable';
import { Button, Card, Icon, Spinner } from './ui';

interface SimulationHistoryProps {
  status: SimulationsStatus;
  simulations: Simulation[];
  onRetry: () => void;
  className?: string;
}

function simulationCountLabel(count: number): string {
  return count === 1 ? '1 simulación' : `${count} simulaciones`;
}

export function SimulationHistory({
  status,
  simulations,
  onRetry,
  className,
}: SimulationHistoryProps) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Icon className="text-link" icon={History} size={24} />
          <h2 className="text-title-md text-text">Historial</h2>
        </div>
        <span className="text-caption text-text-muted">
          {simulationCountLabel(simulations.length)}
        </span>
      </div>

      <div className="mt-6">
        {status === 'loading' ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-4 text-text-muted">
            <Spinner label="Cargando historial" />
            <p className="font-medium">Cargando historial…</p>
          </div>
        ) : status === 'error' ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-4 text-center">
            <p className="font-medium text-text">
              No se pudo cargar el historial.
            </p>
            <Button variant="danger" onClick={onRetry}>
              Reintentar
            </Button>
          </div>
        ) : simulations.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-card border border-dashed border-border p-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-link">
              <Icon icon={FolderOpen} size={24} />
            </span>
            <p className="mt-4 font-medium text-text">
              Todavía no hay simulaciones guardadas.
            </p>
            <p className="mt-1 text-sm text-text-muted">
              Mueve el slider y pulsa «Guardar simulación».
            </p>
          </div>
        ) : (
          <>
            <SimulationHistoryTable simulations={simulations} />
            <SimulationHistoryCards simulations={simulations} />
          </>
        )}
      </div>
    </Card>
  );
}
