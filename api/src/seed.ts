import { CreateCustomer } from './application/use-cases/customers/createCustomer.js';
import { SearchCustomers } from './application/use-cases/customers/searchCustomers.js';
import { CreateSimulation } from './application/use-cases/simulations/createSimulation.js';
import { createDatabase } from './infrastructure/db/connection.js';
import { SqliteCustomerRepository } from './infrastructure/db/SqliteCustomerRepository.js';
import { SqliteSimulationRepository } from './infrastructure/db/SqliteSimulationRepository.js';
import { seedDemoData } from './infrastructure/seed/seedDemoData.js';

const database = createDatabase(process.env.DATABASE_PATH ?? 'saas-o-matic.sqlite');

try {
  const customers = new SqliteCustomerRepository(database);
  const simulations = new SqliteSimulationRepository(database);
  const result = seedDemoData({
    createCustomer: new CreateCustomer(customers),
    searchCustomers: new SearchCustomers(customers),
    createSimulation: new CreateSimulation(customers, simulations),
  });

  if (result.status === 'seeded') {
    console.log(
      `Datos de demostración cargados: ${result.customers} clientes y ${result.simulations} simulaciones.`,
    );
  } else {
    console.log('La base de datos ya tiene clientes; no se carga nada.');
  }
} finally {
  database.close();
}
