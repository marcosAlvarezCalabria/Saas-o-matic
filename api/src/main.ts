import { CreateCustomer } from './application/use-cases/customers/createCustomer.js';
import { GetCustomer } from './application/use-cases/customers/getCustomer.js';
import { SearchCustomers } from './application/use-cases/customers/searchCustomers.js';
import { CreateSimulation } from './application/use-cases/simulations/createSimulation.js';
import { ArchiveSimulation } from './application/use-cases/simulations/archiveSimulation.js';
import { ListCustomerSimulations } from './application/use-cases/simulations/listCustomerSimulations.js';
import { PreviewSimulation } from './application/use-cases/simulations/previewSimulation.js';
import { RestoreSimulation } from './application/use-cases/simulations/restoreSimulation.js';
import { createDatabase } from './infrastructure/db/connection.js';
import { SqliteCustomerRepository } from './infrastructure/db/SqliteCustomerRepository.js';
import { SqliteSimulationRepository } from './infrastructure/db/SqliteSimulationRepository.js';
import { createApp } from './infrastructure/http/app.js';
import { parseCorsOrigins } from './infrastructure/http/corsOrigins.js';

const port = Number(process.env.PORT ?? 3000);
const database = createDatabase(process.env.DATABASE_PATH ?? 'saas-o-matic.sqlite');
const customers = new SqliteCustomerRepository(database);
const simulations = new SqliteSimulationRepository(database);
const app = createApp(
  {
    createCustomer: new CreateCustomer(customers),
    getCustomer: new GetCustomer(customers),
    searchCustomers: new SearchCustomers(customers),
    createSimulation: new CreateSimulation(customers, simulations),
    archiveSimulation: new ArchiveSimulation(simulations),
    listCustomerSimulations: new ListCustomerSimulations(customers, simulations),
    previewSimulation: new PreviewSimulation(customers),
    restoreSimulation: new RestoreSimulation(simulations),
  },
  {
    corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
    trustProxy: Number(process.env.TRUST_PROXY ?? 0),
  },
);

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
