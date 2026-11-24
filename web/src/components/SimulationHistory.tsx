import { useState } from 'react';
import { FolderOpen, History } from 'lucide-react';

import type { Customer, Simulation } from '../api/types';
import { useCurrency } from '../context/CurrencyContext';
import type { SimulationsStatus } from '../hooks/useSimulations';
import { paginate } from '../lib/pagination';
import { SimulationHistoryList } from './SimulationHistoryList';
import { Button, Card, Icon, Spinner } from './ui';

interface SimulationHistoryProps {
  status: SimulationsStatus;
  simulations: Simulation[];
  customer: Customer;
  onRetry: () => void;
  className?: string;
}

const PAGE_SIZE = 5;
const ratesDateFormatter = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'long',
});

function formatRatesDate(updatedAt: string | null): string | null {
  if (updatedAt === null) {
    return null;
  }

  const date = new Date(updatedAt);
  return Number.isNaN(date.getTime()) ? null : ratesDateFormatter.format(date);
}

function simulationCountLabel(count: number): string {
  return count === 1 ? '1 simulación' : `${count} simulaciones`;
}

export function SimulationHistory({
  status,
  simulations,
  customer,
  onRetry,
  className,
}: SimulationHistoryProps) {
  const [page, setPage] = useState(1);
  const { currency, rate, updatedAt } = useCurrency();
  const paginated = paginate(simulations, page, PAGE_SIZE);
  const ratesDate = formatRatesDate(updatedAt);
  const conversion =
    currency === 'EUR' || ratesDate === null
      ? null
      : {
          currency,
          rate,
          ratesDate,
        };
  const initialLoading = status === 'loading' && simulations.length === 0;
  const refreshing = status === 'loading' && simulations.length > 0;

  return (
    <Card className={className} padding="compact">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4 lg:pb-2">
        <div className="flex items-center gap-3">
          <Icon className="text-link" icon={History} size={24} />
          <h2 className="text-title-md text-text">Historial</h2>
        </div>
        <span className="text-caption text-text-muted">
          {simulationCountLabel(simulations.length)}
        </span>
      </div>

      <div className="mt-6 lg:mt-4">
        {initialLoading ? (
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
            <SimulationHistoryList
              conversion={conversion}
              customer={customer}
              refreshing={refreshing}
              simulations={paginated.items}
            />
            {simulations.length > PAGE_SIZE ? (
              <nav
                aria-label="Paginación del historial"
                className="mt-4 flex items-center justify-center gap-2"
              >
                <Button
                  disabled={paginated.page === 1}
                  size="compact"
                  variant="secondary"
                  onClick={() => setPage(paginated.page - 1)}
                >
                  Anterior
                </Button>
                <span className="text-center text-caption text-text-muted">
                  Página {paginated.page} de {paginated.pageCount}
                </span>
                <Button
                  disabled={paginated.page === paginated.pageCount}
                  size="compact"
                  variant="secondary"
                  onClick={() => setPage(paginated.page + 1)}
                >
                  Siguiente
                </Button>
              </nav>
            ) : null}
          </>
        )}
      </div>
    </Card>
  );
}
