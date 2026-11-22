import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { validCustomer, validFrenchCustomer } from './customerFixtures.js';
import { createTestContext, type TestContext } from './testContext.js';

describe('POST /simulations/preview', () => {
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

  it.each([
    {
      country: 'ES' as const,
      users: 15,
      expected: { baseCents: 14_000, vatRateBasisPoints: 2_100, vatCents: 2_940, totalCents: 16_940 },
    },
    {
      country: 'FR' as const,
      users: 51,
      expected: { baseCents: 42_500, vatRateBasisPoints: 2_000, vatCents: 8_500, totalCents: 51_000 },
    },
    {
      country: 'ES' as const,
      users: 100_000,
      expected: {
        baseCents: 50_017_000,
        vatRateBasisPoints: 2_100,
        vatCents: 10_503_570,
        totalCents: 60_520_570,
      },
    },
  ])('returns the breakdown for $users users in $country', async ({ country, users, expected }) => {
    const response = await request(context.app)
      .post('/simulations/preview')
      .send({ customerId: customerIds[country], users })
      .expect(200);

    expect(response.body).toEqual(expected);
  });

  it('returns only the cost breakdown fields', async () => {
    const response = await request(context.app)
      .post('/simulations/preview')
      .send({ customerId: customerIds.ES, users: 15, totalCents: 1, discount: 50 })
      .expect(200);

    expect(Object.keys(response.body).sort()).toEqual(
      ['baseCents', 'totalCents', 'vatCents', 'vatRateBasisPoints'].sort(),
    );
  });

  it('does not save a preview in the customer history', async () => {
    await request(context.app)
      .post('/simulations/preview')
      .send({ customerId: customerIds.ES, users: 15 })
      .expect(200);

    const history = await request(context.app)
      .get(`/customers/${customerIds.ES}/simulations`)
      .expect(200);
    expect(history.body).toEqual([]);
  });
});
