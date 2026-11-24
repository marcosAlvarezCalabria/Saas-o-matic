import type { Simulation } from '../api/types';
import { formatVatRate } from '../lib/vatRate';
import { Money } from './Money';
import {
  formatSimulationDate,
  formatSimulationUsage,
} from './simulationHistoryFormat';

interface SimulationHistoryTableProps {
  simulations: Simulation[];
}

export function SimulationHistoryTable({
  simulations,
}: SimulationHistoryTableProps) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border text-caption uppercase text-text-muted">
            <th className="py-3 pr-3 font-semibold" scope="col">
              Fecha
            </th>
            <th className="px-3 py-3 text-center font-semibold" scope="col">
              Usuarios
            </th>
            <th className="px-3 py-3 text-right font-semibold" scope="col">
              Base
            </th>
            <th className="px-3 py-3 text-right font-semibold" scope="col">
              IVA
            </th>
            <th className="py-3 pl-3 text-right font-semibold" scope="col">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {simulations.map((simulation) => (
            <tr key={simulation.id}>
              <td className="py-4 pr-3 align-top text-sm font-medium text-text">
                <div>{formatSimulationDate(simulation.createdAt)}</div>
                <div className="mt-1 text-caption font-normal text-text-muted">
                  {formatSimulationUsage(
                    simulation.storageGb,
                    simulation.apiCalls,
                  )}
                </div>
              </td>
              <td className="px-3 py-4 text-center text-sm text-text">
                {simulation.users} usuarios
              </td>
              <td className="px-3 py-4 text-right text-sm text-text">
                <Money cents={simulation.baseCents} />
              </td>
              <td className="px-3 py-4 text-right text-sm text-text-muted">
                <span className="sr-only">
                  {formatVatRate(simulation.vatRateBasisPoints)} ·{' '}
                </span>
                <Money cents={simulation.vatCents} />
              </td>
              <td className="py-4 pl-3 text-right text-title-sm text-text">
                <Money cents={simulation.totalCents} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
