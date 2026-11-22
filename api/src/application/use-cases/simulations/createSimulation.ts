import { calculateMonthlyCost } from '../../../domain/pricing/calculateMonthlyCost.js';
import { validateUsers } from '../../../domain/pricing/tiers.js';
import { validateUsage, type Simulation } from '../../../domain/simulation.js';
import { ApplicationError } from '../../errors.js';
import type { CustomerRepository } from '../../ports/CustomerRepository.js';
import type { SimulationRepository } from '../../ports/SimulationRepository.js';

export interface CreateSimulationInput {
  customerId: number;
  users: number;
  storageGb?: number;
  apiCalls?: number;
}

export class CreateSimulation {
  constructor(
    private readonly customers: CustomerRepository,
    private readonly simulations: SimulationRepository,
  ) {}

  execute(input: CreateSimulationInput): Simulation {
    validateUsers(input.users);
    const usage = validateUsage(input);
    const customer = this.customers.findById(input.customerId);

    if (customer === null) {
      throw new ApplicationError('CUSTOMER_NOT_FOUND', 'El cliente no existe');
    }

    const cost = calculateMonthlyCost(customer.country, input.users);

    return this.simulations.create({
      customerId: input.customerId,
      users: input.users,
      ...usage,
      ...cost,
    });
  }
}
