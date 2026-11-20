import type { Customer, CustomerPlan } from '../../domain/customer.js';

export interface CustomerToCreate {
  companyName: string;
  companyNameSearch: string;
  taxId: string;
  email: string;
  country: string;
  plan: CustomerPlan;
}

export interface CustomerSearch {
  companyName: string;
  taxId: string;
}

export interface CustomerRepository {
  create(customer: CustomerToCreate): Customer;
  findById(id: number): Customer | null;
  findByTaxId(taxId: string): Customer | null;
  search(search: CustomerSearch): Customer[];
}
