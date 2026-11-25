import { Archive, ArchiveRestore, Mail } from 'lucide-react';

import type { Customer, Simulation } from '../api/types';
import type { SimulationConversion } from '../lib/simulationEmail';
import { buildSimulationMailto } from '../lib/simulationEmail';
import { formatVatRate } from '../lib/vatRate';
import { BilledInEuros } from './BilledInEuros';
import { Money } from './Money';
import {
  formatSimulationDate,
  formatSimulationUsage,
} from './simulationHistoryFormat';
import { AnchorButton, Button, Icon } from './ui';

export type SimulationHistoryView = 'active' | 'archived';

interface SimulationHistoryListProps {
  customer: Customer;
  simulations: Simulation[];
  conversion: SimulationConversion | null;
  refreshing: boolean;
  view: SimulationHistoryView;
  busyId: number | null;
  onArchive: (simulation: Simulation) => void;
  onRestore: (simulation: Simulation) => void;
}

export function SimulationHistoryList({
  customer,
  simulations,
  conversion,
  refreshing,
  view,
  busyId,
  onArchive,
  onRestore,
}: SimulationHistoryListProps) {
  return (
    <div aria-busy={refreshing}>
      {refreshing ? (
        <span className="sr-only" role="status">
          Actualizando historial…
        </span>
      ) : null}
      <ul
        className={`divide-y divide-border transition-opacity duration-150 ${refreshing ? 'opacity-50' : ''}`}
      >
        {simulations.map((simulation) => (
          <li
            className="py-3 first:pt-0 last:pb-0 lg:flex lg:flex-wrap lg:items-center lg:gap-x-3"
            key={simulation.id}
          >
            <div className="flex min-w-0 items-start justify-between gap-4 lg:flex-1 lg:items-center">
              <time
                className="text-sm font-medium text-text"
                dateTime={simulation.createdAt}
              >
                {formatSimulationDate(simulation.createdAt)}
              </time>
              <div className="text-right text-title-sm text-text">
                <Money cents={simulation.totalCents} />
                <BilledInEuros
                  cents={simulation.totalCents}
                  variant="short"
                />
              </div>
            </div>
            <div className="mt-2 min-w-0 text-caption text-text-muted lg:order-3 lg:w-full lg:mt-0">
              <p>
                {simulation.users} usuarios ·{' '}
                {formatSimulationUsage(
                  simulation.storageGb,
                  simulation.apiCalls,
                )}
              </p>
              <p className="mt-1 lg:mt-0">
                Base <Money cents={simulation.baseCents} /> ·{' '}
                IVA ({formatVatRate(simulation.vatRateBasisPoints)}){' '}
                <Money cents={simulation.vatCents} />
              </p>
              {view === 'archived' ? (
                <p className="mt-1">
                  {archivedDateLabel(simulation.archivedAt)}
                </p>
              ) : null}
            </div>
            <div className="mt-3 flex w-full flex-col gap-2 md:w-auto lg:order-2 lg:mt-0 lg:shrink-0 lg:flex-row lg:items-center lg:gap-1">
              {view === 'active' ? (
                <>
                  <AnchorButton
                    href={buildSimulationMailto(customer, simulation, conversion)}
                    size="compact"
                    variant="soft"
                  >
                    <Icon icon={Mail} size={18} />
                    <span className="lg:sr-only">Enviar</span>
                  </AnchorButton>
                  <Button
                    aria-label={`Archivar la simulación del ${formatSimulationDate(simulation.createdAt)}`}
                    disabled={busyId !== null}
                    size="compact"
                    variant="secondary"
                    onClick={() => onArchive(simulation)}
                  >
                    <Icon className="lg:hidden" icon={Archive} size={18} />
                    <span>Archivar</span>
                  </Button>
                </>
              ) : (
                <Button
                  aria-label={`Recuperar la simulación del ${formatSimulationDate(simulation.createdAt)}`}
                  disabled={busyId !== null}
                  size="compact"
                  variant="secondary"
                  onClick={() => onRestore(simulation)}
                >
                  <Icon
                    className="lg:hidden"
                    icon={ArchiveRestore}
                    size={18}
                  />
                  <span>Recuperar</span>
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function archivedDateLabel(archivedAt: string | null): string {
  return archivedAt === null
    ? 'Archivada'
    : `Archivada el ${formatSimulationDate(archivedAt)}`;
}
