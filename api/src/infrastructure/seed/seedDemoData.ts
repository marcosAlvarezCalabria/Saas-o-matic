import type { CreateCustomer } from '../../application/use-cases/customers/createCustomer.js';
import type { SearchCustomers } from '../../application/use-cases/customers/searchCustomers.js';
import type { CreateSimulation } from '../../application/use-cases/simulations/createSimulation.js';
import type { ArchiveSimulation } from '../../application/use-cases/simulations/archiveSimulation.js';
import { DEMO_CUSTOMERS } from './demoData.js';

interface SeedDemoDataDependencies {
  createCustomer: Pick<CreateCustomer, 'execute'>;
  searchCustomers: Pick<SearchCustomers, 'execute'>;
  createSimulation: Pick<CreateSimulation, 'execute'>;
  archiveSimulation: Pick<ArchiveSimulation, 'execute'>;
}

type SeedDemoDataResult =
  | { status: 'seeded'; customers: number; simulations: number; archived: number }
  | { status: 'skipped' };

export function seedDemoData({
  createCustomer,
  searchCustomers,
  createSimulation,
  archiveSimulation,
}: SeedDemoDataDependencies): SeedDemoDataResult {
  if (searchCustomers.execute('').length > 0) {
    return { status: 'skipped' };
  }

  let simulationCount = 0;
  let archivedCount = 0;

  for (const { simulations, ...customerData } of DEMO_CUSTOMERS) {
    const customer = createCustomer.execute(customerData);

    for (const { archived = false, ...simulationData } of simulations) {
      const simulation = createSimulation.execute({
        customerId: customer.id,
        ...simulationData,
      });
      simulationCount += 1;

      if (archived) {
        archiveSimulation.execute(simulation.id);
        archivedCount += 1;
      }
    }
  }

  return {
    status: 'seeded',
    customers: DEMO_CUSTOMERS.length,
    simulations: simulationCount,
    archived: archivedCount,
  };
}
