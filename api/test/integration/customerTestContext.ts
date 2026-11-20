import type Database from 'better-sqlite3';
import type { Express } from 'express';

import { CreateCustomer } from '../../src/application/createCustomer.js';
import { GetCustomer } from '../../src/application/getCustomer.js';
import { SearchCustomers } from '../../src/application/searchCustomers.js';
import { createDatabase } from '../../src/infrastructure/db/connection.js';
import { SqliteCustomerRepository } from '../../src/infrastructure/db/SqliteCustomerRepository.js';
import { createApp } from '../../src/infrastructure/http/app.js';

export interface CustomerTestContext {
  app: Express;
  database: Database.Database;
}

export function createCustomerTestContext(): CustomerTestContext {
  const database = createDatabase(':memory:');
  const customers = new SqliteCustomerRepository(database);
  const app = createApp({
    createCustomer: new CreateCustomer(customers),
    getCustomer: new GetCustomer(customers),
    searchCustomers: new SearchCustomers(customers),
  });

  return { app, database };
}
