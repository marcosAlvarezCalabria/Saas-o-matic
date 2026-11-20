import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { registerSearchCustomers } from './customerFixtures.js';
import {
  createCustomerTestContext,
  type CustomerTestContext,
} from './customerTestContext.js';

describe('GET /customers', () => {
  let context: CustomerTestContext;

  beforeEach(async () => {
    context = createCustomerTestContext();
    await registerSearchCustomers(context.app);
  });

  afterEach(() => {
    context.database.close();
  });

  it.each([
    {
      search: '',
      expected: ['Logística Norte SA', 'Acme Deutschland', 'Café Ibérico S.L.'],
    },
    { search: 'cafe', expected: ['Café Ibérico S.L.'] },
    { search: 'ACME', expected: ['Acme Deutschland'] },
    { search: 'b-5875', expected: ['Café Ibérico S.L.'] },
    { search: '58754201', expected: ['Logística Norte SA', 'Café Ibérico S.L.'] },
    { search: 'zzz', expected: [] },
  ])('searches customers using "$search"', async ({ search, expected }) => {
    const response = await request(context.app)
      .get('/customers')
      .query({ search })
      .expect(200);

    expect(response.body.map((customer: { companyName: string }) => customer.companyName)).toEqual(
      expected,
    );
  });

  it('treats SQL wildcard characters as text', async () => {
    const response = await request(context.app)
      .get('/customers')
      .query({ search: '%' })
      .expect(200);

    expect(response.body).toEqual([]);
  });
});
