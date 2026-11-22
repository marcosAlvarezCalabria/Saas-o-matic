import {
  calculateMonthlyCost,
  type CostBreakdown,
} from '../../../domain/pricing/calculateMonthlyCost.js';
import { validateUsers } from '../../../domain/pricing/tiers.js';
import { ApplicationError } from '../../errors.js';
import type { CustomerRepository } from '../../ports/CustomerRepository.js';

export interface PreviewSimulationInput {
  customerId: number;
  users: number;
}

export class PreviewSimulation {
  constructor(private readonly customers: CustomerRepository) {}

  execute(input: PreviewSimulationInput): CostBreakdown {
    validateUsers(input.users);
    const customer = this.customers.findById(input.customerId);

    if (customer === null) {
      throw new ApplicationError('CUSTOMER_NOT_FOUND', 'El cliente no existe');
    }

    return calculateMonthlyCost(customer.country, input.users);
  }
}
