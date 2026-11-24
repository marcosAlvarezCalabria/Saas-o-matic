import type { Simulation } from '../api/types';
import { formatVatRate } from '../lib/vatRate';
import { Money } from './Money';
import {
  formatSimulationDate,
  formatSimulationUsage,
} from './simulationHistoryFormat';

interface SimulationHistoryCardsProps {
  simulations: Simulation[];
}

export function SimulationHistoryCards({
  simulations,
}: SimulationHistoryCardsProps) {
  return (
    <ul className="divide-y divide-border md:hidden">
      {simulations.map((simulation) => (
        <li className="py-4 first:pt-0 last:pb-0" key={simulation.id}>
          <div className="flex items-start justify-between gap-4">
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
          <div className="mt-2 flex items-start justify-between gap-4 text-sm text-text-muted">
            <span>{simulation.users} usuarios</span>
            <span className="text-right text-caption">
              {formatSimulationUsage(
                simulation.storageGb,
                simulation.apiCalls,
              )}
            </span>
          </div>
          <div className="mt-3 flex items-start justify-between gap-4 text-caption text-text-muted">
            <span>
              Base: <Money cents={simulation.baseCents} />
            </span>
            <span className="text-right">
              IVA ({formatVatRate(simulation.vatRateBasisPoints)}):{' '}
              <Money cents={simulation.vatCents} />
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
