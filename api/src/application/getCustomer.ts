import type { Customer } from '../domain/customer.js';
import { ApplicationError } from './errors.js';
import type { CustomerRepository } from './ports/CustomerRepository.js';

export class GetCustomer {
  constructor(private readonly customers: CustomerRepository) {}

  execute(id: number): Customer {
    const customer = this.customers.findById(id);

    if (customer === null) {
      throw new ApplicationError('CUSTOMER_NOT_FOUND', 'El cliente no existe');
    }

    return customer;
  }
}
