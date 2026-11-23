import { request } from './apiClient';
import type { CreateCustomerInput, Customer } from './types';

export function searchCustomers(
  search: string,
  signal?: AbortSignal,
): Promise<Customer[]> {
  const query = new URLSearchParams({ search });
  return request<Customer[]>(`/customers?${query.toString()}`, { signal });
}

export function getCustomer(
  id: number,
  signal?: AbortSignal,
): Promise<Customer> {
  return request<Customer>(`/customers/${id}`, { signal });
}

export function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  return request<Customer>('/customers', {
    method: 'POST',
    body: input,
  });
}
