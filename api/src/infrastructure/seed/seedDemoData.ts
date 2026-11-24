import type { CreateCustomer } from '../../application/use-cases/customers/createCustomer.js';
import type { SearchCustomers } from '../../application/use-cases/customers/searchCustomers.js';
import type { CreateSimulation } from '../../application/use-cases/simulations/createSimulation.js';
import { DEMO_CUSTOMERS } from './demoData.js';

interface SeedDemoDataDependencies {
  createCustomer: Pick<CreateCustomer, 'execute'>;
  searchCustomers: Pick<SearchCustomers, 'execute'>;
  createSimulation: Pick<CreateSimulation, 'execute'>;
}

type SeedDemoDataResult =
  | { status: 'seeded'; customers: number; simulations: number }
  | { status: 'skipped' };

export function seedDemoData({
  createCustomer,
  searchCustomers,
  createSimulation,
}: SeedDemoDataDependencies): SeedDemoDataResult {
  if (searchCustomers.execute('').length > 0) {
    return { status: 'skipped' };
  }

  let simulationCount = 0;

  for (const { simulations, ...customerData } of DEMO_CUSTOMERS) {
    const customer = createCustomer.execute(customerData);

    for (const simulation of simulations) {
      createSimulation.execute({ customerId: customer.id, ...simulation });
      simulationCount += 1;
    }
  }

  return {
    status: 'seeded',
    customers: DEMO_CUSTOMERS.length,
    simulations: simulationCount,
  };
}
