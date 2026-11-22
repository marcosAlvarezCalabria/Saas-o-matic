import { CreateCustomer } from './application/use-cases/customers/createCustomer.js';
import { GetCustomer } from './application/use-cases/customers/getCustomer.js';
import { SearchCustomers } from './application/use-cases/customers/searchCustomers.js';
import { createDatabase } from './infrastructure/db/connection.js';
import { SqliteCustomerRepository } from './infrastructure/db/SqliteCustomerRepository.js';
import { createApp } from './infrastructure/http/app.js';

const port = Number(process.env.PORT ?? 3000);
const database = createDatabase(process.env.DATABASE_PATH ?? 'saas-o-matic.sqlite');
const customers = new SqliteCustomerRepository(database);
const app = createApp({
  createCustomer: new CreateCustomer(customers),
  getCustomer: new GetCustomer(customers),
  searchCustomers: new SearchCustomers(customers),
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
