import type Database from 'better-sqlite3';
import type { Express } from 'express';

import { CreateCustomer } from '../../src/application/use-cases/customers/createCustomer.js';
import { GetCustomer } from '../../src/application/use-cases/customers/getCustomer.js';
import { SearchCustomers } from '../../src/application/use-cases/customers/searchCustomers.js';
import { CreateSimulation } from '../../src/application/use-cases/simulations/createSimulation.js';
import { ListCustomerSimulations } from '../../src/application/use-cases/simulations/listCustomerSimulations.js';
import { PreviewSimulation } from '../../src/application/use-cases/simulations/previewSimulation.js';
import { createDatabase } from '../../src/infrastructure/db/connection.js';
import { SqliteCustomerRepository } from '../../src/infrastructure/db/SqliteCustomerRepository.js';
import { SqliteSimulationRepository } from '../../src/infrastructure/db/SqliteSimulationRepository.js';
import { createApp } from '../../src/infrastructure/http/app.js';

export interface TestContext {
  app: Express;
  database: Database.Database;
}

export function createTestContext(): TestContext {
  const database = createDatabase(':memory:');
  const customers = new SqliteCustomerRepository(database);
  const simulations = new SqliteSimulationRepository(database);
  const app = createApp({
    createCustomer: new CreateCustomer(customers),
    getCustomer: new GetCustomer(customers),
    searchCustomers: new SearchCustomers(customers),
    createSimulation: new CreateSimulation(customers, simulations),
    listCustomerSimulations: new ListCustomerSimulations(customers, simulations),
    previewSimulation: new PreviewSimulation(customers),
  });

  return { app, database };
}
