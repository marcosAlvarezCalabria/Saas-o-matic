import { normalizeCompanyNameForSearch, type Customer } from '../../../domain/customer.js';
import { normalizeTaxId } from '../../../domain/tax-id/normalizeTaxId.js';
import type { CustomerRepository } from '../../ports/CustomerRepository.js';

export class SearchCustomers {
  constructor(private readonly customers: CustomerRepository) {}

  execute(search = ''): Customer[] {
    return this.customers.search({
      companyName: normalizeCompanyNameForSearch(search),
      taxId: normalizeTaxId(search),
    });
  }
}
