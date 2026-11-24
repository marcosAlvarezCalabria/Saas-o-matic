import type Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { CreateCustomer } from '../../src/application/use-cases/customers/createCustomer.js';
import { SearchCustomers } from '../../src/application/use-cases/customers/searchCustomers.js';
import { ArchiveSimulation } from '../../src/application/use-cases/simulations/archiveSimulation.js';
import { CreateSimulation } from '../../src/application/use-cases/simulations/createSimulation.js';
import type { Customer } from '../../src/domain/customer.js';
import { createDatabase } from '../../src/infrastructure/db/connection.js';
import { SqliteCustomerRepository } from '../../src/infrastructure/db/SqliteCustomerRepository.js';
import { SqliteSimulationRepository } from '../../src/infrastructure/db/SqliteSimulationRepository.js';
import { seedDemoData } from '../../src/infrastructure/seed/seedDemoData.js';

interface SeedTestContext {
  database: Database.Database;
  createCustomer: CreateCustomer;
  searchCustomers: SearchCustomers;
  createSimulation: CreateSimulation;
  archiveSimulation: ArchiveSimulation;
  simulations: SqliteSimulationRepository;
}

describe('seedDemoData', () => {
  let context: SeedTestContext;

  beforeEach(() => {
    context = createSeedTestContext();
  });

  afterEach(() => {
    context.database.close();
  });

  it('loads the complete demonstration dataset into an empty database', () => {
    const result = runSeed(context);
    const customers = context.searchCustomers.execute('');
    const nubeNorte = findCustomer(customers, 'Nube Norte S.L.');
    const tallerIberico = findCustomer(customers, 'Taller Ibérico');

    expect(result).toEqual({
      status: 'seeded',
      customers: 9,
      simulations: 19,
      archived: 1,
    });
    expect(customers).toHaveLength(9);
    expect(context.simulations.findByCustomerId(nubeNorte.id)).toHaveLength(6);
    expect(
      context.simulations.findByCustomerId(nubeNorte.id, { archived: true }),
    ).toEqual([expect.objectContaining({ users: 5 })]);
    expect(context.simulations.findByCustomerId(tallerIberico.id)).toHaveLength(0);
    expect(context.searchCustomers.execute('nube')).toHaveLength(2);
    expect(context.searchCustomers.execute('iberico')).toHaveLength(1);
    expect(customers.every(({ email }) => email.endsWith('.example.com'))).toBe(true);
  });

  it('does not duplicate data when run a second time', () => {
    runSeed(context);

    expect(runSeed(context)).toEqual({ status: 'skipped' });
    expect(context.searchCustomers.execute('')).toHaveLength(9);
    expect(countSimulations(context)).toBe(19);
  });

  it('does not add data when the database already has another customer', () => {
    context.createCustomer.execute({
      companyName: 'Cliente existente S.L.',
      taxId: 'B58754201',
      email: 'cliente@existente.example.com',
      country: 'ES',
      plan: 'basic',
    });

    expect(runSeed(context)).toEqual({ status: 'skipped' });
    expect(context.searchCustomers.execute('')).toHaveLength(1);
    expect(countSimulations(context)).toBe(0);
  });
});

function createSeedTestContext(): SeedTestContext {
  const database = createDatabase(':memory:');
  const customers = new SqliteCustomerRepository(database);
  const simulations = new SqliteSimulationRepository(database);

  return {
    database,
    createCustomer: new CreateCustomer(customers),
    searchCustomers: new SearchCustomers(customers),
    createSimulation: new CreateSimulation(customers, simulations),
    archiveSimulation: new ArchiveSimulation(simulations),
    simulations,
  };
}

function runSeed(context: SeedTestContext) {
  return seedDemoData({
    createCustomer: context.createCustomer,
    searchCustomers: context.searchCustomers,
    createSimulation: context.createSimulation,
    archiveSimulation: context.archiveSimulation,
  });
}

function findCustomer(customers: Customer[], companyName: string): Customer {
  const customer = customers.find((candidate) => candidate.companyName === companyName);

  if (customer === undefined) {
    throw new Error(`Missing test customer: ${companyName}`);
  }

  return customer;
}

function countSimulations(context: SeedTestContext): number {
  return context.searchCustomers
    .execute('')
    .reduce(
      (total, customer) =>
        total +
        context.simulations.findByCustomerId(customer.id).length +
        context.simulations.findByCustomerId(customer.id, { archived: true }).length,
      0,
    );
}
