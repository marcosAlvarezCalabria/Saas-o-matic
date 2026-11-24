import type { CostBreakdown } from '../../domain/pricing/calculateMonthlyCost.js';
import type { Simulation } from '../../domain/simulation.js';

export interface SimulationToCreate extends CostBreakdown {
  customerId: number;
  users: number;
  storageGb: number;
  apiCalls: number;
}

export interface SimulationListOptions {
  archived: boolean;
}

export interface SimulationRepository {
  create(simulation: SimulationToCreate): Simulation;
  findByCustomerId(customerId: number, options?: SimulationListOptions): Simulation[];
  archive(id: number): Simulation | null;
  restore(id: number): Simulation | null;
}
