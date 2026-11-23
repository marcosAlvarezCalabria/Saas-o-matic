import { afterEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { createTestContext, type TestContext } from './testContext.js';

const HIGH_LIMIT = 100;

describe('rate limiting', () => {
  let context: TestContext;

  afterEach(() => {
    context.database.close();
  });

  it('returns 429 with Retry-After after exceeding the write limit', async () => {
    context = createLimitedContext({ writeLimit: 2, generalLimit: HIGH_LIMIT });

    await createCustomer(0).expect(201);
    await createCustomer(1).expect(201);
    const response = await createCustomer(2).expect(429);

    expect(response.body.error.code).toBe('RATE_LIMITED');
    expect(response.headers['retry-after']).toBeDefined();
  });

  it('accepts another write after the time window has passed', async () => {
    context = createLimitedContext({ windowMs: 80, writeLimit: 1, generalLimit: HIGH_LIMIT });

    await createCustomer(0).expect(201);
    await createCustomer(1).expect(429);
    await new Promise((resolve) => setTimeout(resolve, 120));
    await createCustomer(1).expect(201);
  });

  it('does not apply the write limit to simulation previews', async () => {
    context = createLimitedContext({ writeLimit: 1, generalLimit: HIGH_LIMIT });

    const customer = await createCustomer(0).expect(201);
    await createCustomer(1).expect(429);
    await request(context.app)
      .post('/simulations/preview')
      .send({ customerId: customer.body.id, users: 15 })
      .expect(200);
  });

  it('returns 429 after exceeding the general limit', async () => {
    context = createLimitedContext({ writeLimit: HIGH_LIMIT, generalLimit: 2 });

    await request(context.app).get('/customers').expect(200);
    await request(context.app).get('/customers').expect(200);
    const response = await request(context.app).get('/customers').expect(429);

    expect(response.body.error.code).toBe('RATE_LIMITED');
  });

  it('never rate limits the health endpoint', async () => {
    context = createLimitedContext({ writeLimit: HIGH_LIMIT, generalLimit: 1 });

    await request(context.app).get('/customers').expect(200);
    await request(context.app).get('/customers').expect(429);
    await request(context.app).get('/health').expect(200);
  });

  it('includes CORS headers in a rate-limited response', async () => {
    context = createLimitedContext({ writeLimit: 1, generalLimit: HIGH_LIMIT });
    const origin = 'http://localhost:5173';

    await createCustomer(0, origin).expect(201);
    const response = await createCustomer(1, origin).expect(429);

    expect(response.headers['access-control-allow-origin']).toBe(origin);
  });

  function createLimitedContext(
    limits: Partial<{ windowMs: number; writeLimit: number; generalLimit: number }>,
  ): TestContext {
    return createTestContext(
      {},
      {
        rateLimits: {
          windowMs: limits.windowMs ?? 1_000,
          writeLimit: limits.writeLimit ?? HIGH_LIMIT,
          generalLimit: limits.generalLimit ?? HIGH_LIMIT,
        },
      },
    );
  }

  function createCustomer(index: number, origin?: string) {
    const customers = [
      { taxId: 'B58754201', companyName: 'Empresa Uno' },
      { taxId: 'A58754201', companyName: 'Empresa Dos' },
      { taxId: '12345678Z', companyName: 'Empresa Tres' },
    ];
    const customer = customers[index];

    if (customer === undefined) {
      throw new Error('Test customer not configured');
    }

    const testRequest = request(context.app)
      .post('/customers')
      .send({
        ...customer,
        email: `empresa${index}@example.es`,
        country: 'ES',
        plan: 'pro',
      });

    return origin === undefined ? testRequest : testRequest.set('Origin', origin);
  }
});
