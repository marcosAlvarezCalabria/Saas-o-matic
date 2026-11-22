import { validateCustomerFields, type Customer } from '../../../domain/customer.js';
import { getVatRateBasisPoints } from '../../../domain/pricing/vat.js';
import { validateTaxId } from '../../../domain/tax-id/validateTaxId.js';
import { ApplicationError } from '../../errors.js';
import type { CustomerRepository } from '../../ports/CustomerRepository.js';

export interface CreateCustomerInput {
  companyName: string;
  taxId: string;
  email: string;
  country: string;
  plan: string;
}

export class CreateCustomer {
  constructor(private readonly customers: CustomerRepository) {}

  execute(input: CreateCustomerInput): Customer {
    const fields = validateCustomerFields(input);
    getVatRateBasisPoints(fields.country);
    const taxId = validateTaxId(fields.country, input.taxId);

    if (this.customers.findByTaxId(taxId) !== null) {
      throw new ApplicationError(
        'TAX_ID_ALREADY_EXISTS',
        'Ya existe un cliente con ese identificador fiscal',
      );
    }

    return this.customers.create({ ...fields, taxId });
  }
}
