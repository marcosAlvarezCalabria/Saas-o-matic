import { FolderOpen } from 'lucide-react';

import type { SimulationHistoryView } from './SimulationHistoryList';
import { Button, Icon, Spinner } from './ui';

export function LoadingHistory() {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-4 text-text-muted">
      <Spinner label="Cargando historial" />
      <p className="font-medium">Cargando historial…</p>
    </div>
  );
}

export function HistoryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-4 text-center">
      <p className="font-medium text-text">No se pudo cargar el historial.</p>
      <Button variant="danger" onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  );
}

export function EmptyHistory({ view }: { view: SimulationHistoryView }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-card border border-dashed border-border p-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-link">
        <Icon icon={FolderOpen} size={24} />
      </span>
      <p className="mt-4 font-medium text-text">
        {view === 'active'
          ? 'Todavía no hay simulaciones guardadas.'
          : 'No hay simulaciones archivadas.'}
      </p>
      {view === 'active' ? (
        <p className="mt-1 text-sm text-text-muted">
          Mueve el slider y pulsa «Guardar simulación».
        </p>
      ) : null}
    </div>
  );
}
