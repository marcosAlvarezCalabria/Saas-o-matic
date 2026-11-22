import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { validCustomer, validFrenchCustomer } from './customerFixtures.js';
import { createTestContext, type TestContext } from './testContext.js';

describe('GET /customers/:id/simulations', () => {
  let context: TestContext;
  let customerIds: Record<'ES' | 'FR', number>;

  beforeEach(async () => {
    context = createTestContext();
    const spanish = await request(context.app).post('/customers').send(validCustomer).expect(201);
    const french = await request(context.app)
      .post('/customers')
      .send(validFrenchCustomer)
      .expect(201);
    customerIds = { ES: spanish.body.id as number, FR: french.body.id as number };
  });

  afterEach(() => {
    context.database.close();
  });

  it('returns the newest simulations first with id as the tie-breaker', async () => {
    for (const users of [15, 40, 51]) {
      await createSimulation(customerIds.ES, users);
    }

    const response = await request(context.app)
      .get(`/customers/${customerIds.ES}/simulations`)
      .expect(200);
    expect(response.body.map((simulation: { users: number }) => simulation.users)).toEqual([
      51, 40, 15,
    ]);
  });

  it('returns the saved cost breakdown', async () => {
    await createSimulation(customerIds.ES, 15);

    const response = await request(context.app)
      .get(`/customers/${customerIds.ES}/simulations`)
      .expect(200);
    expect(response.body[0]).toMatchObject({
      baseCents: 14_000,
      vatRateBasisPoints: 2_100,
      vatCents: 2_940,
      totalCents: 16_940,
    });
  });

  it('returns only simulations belonging to the requested customer', async () => {
    await createSimulation(customerIds.ES, 15);

    const response = await request(context.app)
      .get(`/customers/${customerIds.FR}/simulations`)
      .expect(200);
    expect(response.body).toEqual([]);
  });

  it('returns an empty list when the customer has no simulations', async () => {
    const response = await request(context.app)
      .get(`/customers/${customerIds.FR}/simulations`)
      .expect(200);
    expect(response.body).toEqual([]);
  });

  it('returns CUSTOMER_NOT_FOUND for an unknown customer', async () => {
    const response = await request(context.app).get('/customers/9999/simulations').expect(404);
    expect(response.body.error.code).toBe('CUSTOMER_NOT_FOUND');
  });

  it.each(['abc', '0', '1.0'])('rejects malformed customer id %s', async (id) => {
    const response = await request(context.app).get(`/customers/${id}/simulations`).expect(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  async function createSimulation(customerId: number, users: number): Promise<void> {
    await request(context.app).post('/simulations').send({ customerId, users }).expect(201);
  }
});
