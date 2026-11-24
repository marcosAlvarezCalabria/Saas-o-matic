import type { Simulation } from '../../../domain/simulation.js';
import { ApplicationError } from '../../errors.js';
import type { SimulationRepository } from '../../ports/SimulationRepository.js';

export class RestoreSimulation {
  constructor(private readonly simulations: SimulationRepository) {}

  execute(id: number): Simulation {
    const simulation = this.simulations.restore(id);

    if (simulation === null) {
      throw new ApplicationError(
        'SIMULATION_NOT_FOUND',
        'La simulación no existe',
      );
    }

    return simulation;
  }
}
