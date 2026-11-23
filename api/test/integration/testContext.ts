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
import type { RateLimitOptions } from '../../src/infrastructure/http/rateLimits.js';

export interface TestContext {
  app: Express;
  database: Database.Database;
}

export interface TestUseCaseOverrides {
  createCustomer?: Pick<CreateCustomer, 'execute'>;
  getCustomer?: Pick<GetCustomer, 'execute'>;
  searchCustomers?: Pick<SearchCustomers, 'execute'>;
  createSimulation?: Pick<CreateSimulation, 'execute'>;
  listCustomerSimulations?: Pick<ListCustomerSimulations, 'execute'>;
  previewSimulation?: Pick<PreviewSimulation, 'execute'>;
}

export interface TestAppOptions {
  corsOrigins?: string[];
  rateLimits?: RateLimitOptions;
  trustProxy?: number;
}

export function createTestContext(
  overrides: TestUseCaseOverrides = {},
  options: TestAppOptions = {},
): TestContext {
  const database = createDatabase(':memory:');
  const customers = new SqliteCustomerRepository(database);
  const simulations = new SqliteSimulationRepository(database);
  const useCases = {
    createCustomer: new CreateCustomer(customers),
    getCustomer: new GetCustomer(customers),
    searchCustomers: new SearchCustomers(customers),
    createSimulation: new CreateSimulation(customers, simulations),
    listCustomerSimulations: new ListCustomerSimulations(customers, simulations),
    previewSimulation: new PreviewSimulation(customers),
  };
  const app = createApp(Object.assign(useCases, overrides), {
    corsOrigins: options.corsOrigins ?? ['http://localhost:5173'],
    rateLimits: options.rateLimits ?? {
      windowMs: 60_000,
      writeLimit: 1_000_000,
      generalLimit: 1_000_000,
    },
    trustProxy: options.trustProxy ?? 0,
  });

  return { app, database };
}
