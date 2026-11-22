import type { Simulation } from '../../../domain/simulation.js';
import { ApplicationError } from '../../errors.js';
import type { CustomerRepository } from '../../ports/CustomerRepository.js';
import type { SimulationRepository } from '../../ports/SimulationRepository.js';

export class ListCustomerSimulations {
  constructor(
    private readonly customers: CustomerRepository,
    private readonly simulations: SimulationRepository,
  ) {}

  execute(customerId: number): Simulation[] {
    if (this.customers.findById(customerId) === null) {
      throw new ApplicationError('CUSTOMER_NOT_FOUND', 'El cliente no existe');
    }

    return this.simulations.findByCustomerId(customerId);
  }
}
