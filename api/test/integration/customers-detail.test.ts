import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { validCustomer } from './customerFixtures.js';
import {
  createTestContext as createCustomerTestContext,
  type TestContext as CustomerTestContext,
} from './testContext.js';

describe('GET /customers/:id', () => {
  let context: CustomerTestContext;

  beforeEach(() => {
    context = createCustomerTestContext();
  });

  afterEach(() => {
    context.database.close();
  });

  it('returns an existing customer', async () => {
    const created = await request(context.app).post('/customers').send(validCustomer).expect(201);
    const response = await request(context.app)
      .get(`/customers/${created.body.id}`)
      .expect(200);

    expect(response.body).toEqual(created.body);
  });

  it.each([
    { id: 'abc', status: 400, code: 'VALIDATION_ERROR' },
    { id: '0', status: 400, code: 'VALIDATION_ERROR' },
    { id: '1.0', status: 400, code: 'VALIDATION_ERROR' },
    { id: '1e0', status: 400, code: 'VALIDATION_ERROR' },
    { id: '0x1', status: 400, code: 'VALIDATION_ERROR' },
    { id: '9999', status: 404, code: 'CUSTOMER_NOT_FOUND' },
  ])('returns $status and $code for customer id $id', async ({ id, status, code }) => {
    const response = await request(context.app).get(`/customers/${id}`).expect(status);
    expect(response.body.error.code).toBe(code);
  });
});
