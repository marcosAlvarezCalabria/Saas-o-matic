import { useState } from 'react';

import type { Customer, Simulation } from '../api/types';
import { useCurrency } from '../context/CurrencyContext';
import { useSimulationArchive } from '../hooks/useSimulationArchive';
import {
  useSimulations,
  type SimulationsStatus,
} from '../hooks/useSimulations';
import { paginate } from '../lib/pagination';
import { SimulationHistoryList } from './SimulationHistoryList';
import type { SimulationHistoryView } from './SimulationHistoryList';
import { SimulationHistoryHeader } from './SimulationHistoryHeader';
import { Pagination } from './Pagination';
import {
  EmptyHistory,
  HistoryError,
  LoadingHistory,
} from './SimulationHistoryStates';
import { Card, InlineAlert } from './ui';

interface SimulationHistoryProps {
  status: SimulationsStatus;
  simulations: Simulation[];
  customer: Customer;
  onRetry: () => void;
  onActiveChanged: () => void;
  className?: string;
}

const PAGE_SIZE = 5;
const ratesDateFormatter = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'long',
});

export function SimulationHistory({
  status: activeStatus,
  simulations: activeSimulations,
  customer,
  onRetry: retryActive,
  onActiveChanged,
  className,
}: SimulationHistoryProps) {
  const [view, setView] = useState<SimulationHistoryView>('active');
  const [page, setPage] = useState(1);
  const archived = useSimulations(
    view === 'archived' ? customer.id : null,
    true,
  );
  const actions = useSimulationArchive(handleChanged);
  const { currency, rate, updatedAt } = useCurrency();
  const simulations = view === 'active' ? activeSimulations : archived.simulations;
  const status = view === 'active' ? activeStatus : archived.status;
  const retry = view === 'active' ? retryActive : archived.reload;
  const paginated = paginate(simulations, page, PAGE_SIZE);
  const ratesDate = formatRatesDate(updatedAt);
  const conversion =
    currency === 'EUR' || ratesDate === null
      ? null
      : { currency, rate, ratesDate };
  const initialLoading = status === 'loading' && simulations.length === 0;
  const refreshing = status === 'loading' && simulations.length > 0;
  const undoSimulation =
    actions.notice?.variant === 'success'
      ? actions.notice.undoSimulation
      : undefined;

  function handleChanged(): void {
    onActiveChanged();
    archived.reload();
  }

  function changeView(nextView: SimulationHistoryView): void {
    if (nextView === view) return;
    if (nextView === 'archived') archived.reload();
    setView(nextView);
    setPage(1);
    actions.closeNotice();
  }

  return (
    <Card className={className} padding="compact">
      <SimulationHistoryHeader
        count={simulations.length}
        view={view}
        onViewChange={changeView}
      />

      <div className="mt-4 lg:mt-1">
        {actions.notice ? (
          <InlineAlert
            action={
              undoSimulation
                ? {
                    label: 'Deshacer',
                    onClick: () => actions.restore(undoSimulation),
                  }
                : undefined
            }
            className="mb-4"
            variant={actions.notice.variant}
            onClose={actions.closeNotice}
          >
            {actions.notice.message}
          </InlineAlert>
        ) : null}

        {initialLoading ? (
          <LoadingHistory />
        ) : status === 'error' ? (
          <HistoryError onRetry={retry} />
        ) : simulations.length === 0 ? (
          <EmptyHistory view={view} />
        ) : (
          <>
            <SimulationHistoryList
              busyId={actions.busyId}
              conversion={conversion}
              customer={customer}
              refreshing={refreshing}
              simulations={paginated.items}
              view={view}
              onArchive={actions.archive}
              onRestore={actions.restore}
            />
            <Pagination
              ariaLabel="Paginación del historial"
              className="mt-4 lg:mt-1"
              page={paginated.page}
              pageCount={paginated.pageCount}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </Card>
  );
}

function formatRatesDate(updatedAt: string | null): string | null {
  if (updatedAt === null) return null;
  const date = new Date(updatedAt);
  return Number.isNaN(date.getTime()) ? null : ratesDateFormatter.format(date);
}
