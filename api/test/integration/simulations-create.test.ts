import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { validCustomer } from './customerFixtures.js';
import { createTestContext, type TestContext } from './testContext.js';

type SimulationEndpoint = '/simulations' | '/simulations/preview';

describe('POST /simulations', () => {
  let context: TestContext;
  let customerId: number;

  beforeEach(async () => {
    context = createTestContext();
    const customer = await request(context.app).post('/customers').send(validCustomer).expect(201);
    customerId = customer.body.id as number;
  });

  afterEach(() => {
    context.database.close();
  });

  it('calculates and saves the complete simulation', async () => {
    const response = await request(context.app)
      .post('/simulations')
      .send({ customerId, users: 15, storageGb: 100, apiCalls: 50_000 })
      .expect(201);

    expect(response.body).toMatchObject({
      customerId,
      users: 15,
      storageGb: 100,
      apiCalls: 50_000,
      baseCents: 14_000,
      vatRateBasisPoints: 2_100,
      vatCents: 2_940,
      totalCents: 16_940,
      archivedAt: null,
    });
    expect(response.body.id).toEqual(expect.any(Number));
    expect(response.body.createdAt).toEqual(expect.any(String));

    const history = await request(context.app).get(`/customers/${customerId}/simulations`).expect(200);
    expect(history.body).toEqual([response.body]);
  });

  it('uses zero when storage and API calls are omitted', async () => {
    const response = await request(context.app)
      .post('/simulations')
      .send({ customerId, users: 15 })
      .expect(201);

    expect(response.body).toMatchObject({ storageGb: 0, apiCalls: 0 });
  });

  it('ignores client-provided amounts and unknown fields', async () => {
    const response = await request(context.app)
      .post('/simulations')
      .send({
        customerId,
        users: 15,
        baseCents: 1,
        vatRateBasisPoints: 0,
        vatCents: 0,
        totalCents: 1,
        discount: 50,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      baseCents: 14_000,
      vatRateBasisPoints: 2_100,
      vatCents: 2_940,
      totalCents: 16_940,
    });
    expect(response.body).not.toHaveProperty('discount');
  });

  it.each([
    { endpoint: '/simulations/preview' as const, field: 'users', value: 0 },
    { endpoint: '/simulations/preview' as const, field: 'users', value: 2.5 },
    { endpoint: '/simulations/preview' as const, field: 'users', value: '15' },
    { endpoint: '/simulations/preview' as const, field: 'users', value: null },
    { endpoint: '/simulations/preview' as const, field: 'users', value: 100_001 },
    { endpoint: '/simulations/preview' as const, field: 'customerId', value: 0 },
    { endpoint: '/simulations' as const, field: 'users', value: 100_001 },
    { endpoint: '/simulations' as const, field: 'storageGb', value: -1 },
    { endpoint: '/simulations' as const, field: 'storageGb', value: null },
    { endpoint: '/simulations' as const, field: 'apiCalls', value: 1.5 },
    { endpoint: '/simulations' as const, field: 'apiCalls', value: '50000' },
    { endpoint: '/simulations' as const, field: 'customerId', value: 0 },
    { endpoint: '/simulations' as const, field: 'customerId', value: 1.5 },
    { endpoint: '/simulations' as const, field: 'customerId', value: '1' },
  ])('rejects $field=$value at $endpoint', async ({ endpoint, field, value }) => {
    const body = validSimulationBody(endpoint);
    body[field] = value;

    const response = await request(context.app).post(endpoint).send(body).expect(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it.each([
    { endpoint: '/simulations/preview' as const, field: 'users' },
    { endpoint: '/simulations/preview' as const, field: 'customerId' },
    { endpoint: '/simulations' as const, field: 'users' },
    { endpoint: '/simulations' as const, field: 'customerId' },
  ])('rejects a request to $endpoint without $field', async ({ endpoint, field }) => {
    const body = validSimulationBody(endpoint);
    delete body[field];

    const response = await request(context.app).post(endpoint).send(body).expect(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects a body that is not an object', async () => {
    const response = await request(context.app).post('/simulations').send([]).expect(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('validates values before looking up the customer', async () => {
    const response = await request(context.app)
      .post('/simulations')
      .send({ customerId: 9999, users: 0 })
      .expect(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it.each(['/simulations/preview', '/simulations'] as const)(
    'does not save when the customer does not exist at %s',
    async (endpoint) => {
      const response = await request(context.app)
        .post(endpoint)
        .send({ customerId: 9999, users: 15 })
        .expect(404);

      expect(response.body.error.code).toBe('CUSTOMER_NOT_FOUND');
      expect(countSimulations()).toBe(0);
    },
  );

  function validSimulationBody(endpoint: SimulationEndpoint): Record<string, unknown> {
    return endpoint === '/simulations'
      ? { customerId, users: 15, storageGb: 100, apiCalls: 50_000 }
      : { customerId, users: 15 };
  }

  function countSimulations(): number {
    const row = context.database.prepare('SELECT COUNT(*) AS count FROM simulations').get() as {
      count: number;
    };
    return row.count;
  }
});
