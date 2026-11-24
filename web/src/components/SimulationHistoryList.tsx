import { Mail } from 'lucide-react';

import type { Customer, Simulation } from '../api/types';
import type { SimulationConversion } from '../lib/simulationEmail';
import { buildSimulationMailto } from '../lib/simulationEmail';
import { formatVatRate } from '../lib/vatRate';
import { Money } from './Money';
import {
  formatSimulationDate,
  formatSimulationUsage,
} from './simulationHistoryFormat';
import { AnchorButton } from './ui';

interface SimulationHistoryListProps {
  customer: Customer;
  simulations: Simulation[];
  conversion: SimulationConversion | null;
  refreshing: boolean;
}

export function SimulationHistoryList({
  customer,
  simulations,
  conversion,
  refreshing,
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
            className="py-3 first:pt-0 last:pb-0 lg:grid lg:grid-cols-4 lg:items-center lg:gap-x-3 lg:gap-y-1"
            key={simulation.id}
          >
            <div className="flex items-start justify-between gap-4 lg:col-span-3 lg:items-center">
              <time
                className="text-sm font-medium text-text"
                dateTime={simulation.createdAt}
              >
                {formatSimulationDate(simulation.createdAt)}
              </time>
              <span className="text-right text-title-sm text-text">
                <Money cents={simulation.totalCents} />
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-end justify-between gap-3 lg:contents">
              <div className="min-w-0 text-caption text-text-muted lg:col-span-3 lg:row-start-2 lg:flex lg:items-center lg:gap-3">
                <p>
                  {simulation.users} usuarios ·{' '}
                  {formatSimulationUsage(
                    simulation.storageGb,
                    simulation.apiCalls,
                  )}
                </p>
                <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 lg:mt-0 lg:flex-nowrap">
                  <span>
                    Base <Money cents={simulation.baseCents} />
                  </span>
                  <span>
                    IVA ({formatVatRate(simulation.vatRateBasisPoints)}){' '}
                    <Money cents={simulation.vatCents} />
                  </span>
                </p>
              </div>
              <AnchorButton
                className="w-full md:w-auto lg:col-start-4 lg:row-span-2 lg:row-start-1 lg:px-4"
                href={buildSimulationMailto(customer, simulation, conversion)}
                icon={Mail}
                size="compact"
                variant="soft"
              >
                Enviar
              </AnchorButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
