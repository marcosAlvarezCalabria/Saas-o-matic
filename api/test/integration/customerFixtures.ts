import type { Express } from 'express';
import request from 'supertest';

export const validCustomer = {
  companyName: 'Acme Ibérica S.L.',
  taxId: 'B58754201',
  email: 'compras@acme.es',
  country: 'ES',
  plan: 'pro',
};

export async function registerSearchCustomers(app: Express): Promise<void> {
  const customers = [
    {
      companyName: 'Café Ibérico S.L.',
      taxId: 'B58754201',
      email: 'cafe@example.es',
      country: 'ES',
      plan: 'basic',
    },
    {
      companyName: 'Acme Deutschland',
      taxId: 'DE123456789',
      email: 'acme@example.de',
      country: 'DE',
      plan: 'pro',
    },
    {
      companyName: 'Logística Norte SA',
      taxId: 'A58754201',
      email: 'logistica@example.es',
      country: 'ES',
      plan: 'enterprise',
    },
  ];

  for (const customer of customers) {
    await request(app).post('/customers').send(customer).expect(201);
  }
}
