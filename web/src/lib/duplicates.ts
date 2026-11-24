import type { Simulation } from '../api/types';

export type SimulationValues = Pick<
  Simulation,
  'users' | 'storageGb' | 'apiCalls'
>;

export function isSimulationSaved(
  simulations: readonly Simulation[],
  values: SimulationValues,
): boolean {
  return simulations.some(
    (simulation) =>
      simulation.users === values.users &&
      simulation.storageGb === values.storageGb &&
      simulation.apiCalls === values.apiCalls,
  );
}
