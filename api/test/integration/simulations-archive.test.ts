import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { validCustomer } from './customerFixtures.js';
import { createTestContext, type TestContext } from './testContext.js';

const HIGH_LIMIT = 100;

describe('archive and restore simulations', () => {
  let context: TestContext;
  let customerId: number;
  let simulationIds: Record<15 | 40, number>;

  beforeEach(async () => {
    context = createTestContext();
    const customer = await request(context.app)
      .post('/customers')
      .send(validCustomer)
      .expect(201);
    customerId = customer.body.id as number;
    simulationIds = {
      15: await createSimulation(15),
      40: await createSimulation(40),
    };
  });

  afterEach(() => {
    context.database.close();
  });

  it('archives a simulation without deleting it', async () => {
    const response = await archive(simulationIds[15]).expect(200);

    expect(response.body).toMatchObject({
      id: simulationIds[15],
      users: 15,
      archivedAt: expect.any(String),
    });
    expect(await history()).toEqual([expect.objectContaining({ users: 40 })]);
    expect(await history(true)).toEqual([expect.objectContaining({ users: 15 })]);
  });

  it('preserves the first archived date when archived twice', async () => {
    const first = await archive(simulationIds[15]).expect(200);
    const second = await archive(simulationIds[15]).expect(200);

    expect(second.body.archivedAt).toBe(first.body.archivedAt);
  });

  it('restores an archived simulation', async () => {
    await archive(simulationIds[15]).expect(200);

    const response = await restore(simulationIds[15]).expect(200);

    expect(response.body.archivedAt).toBeNull();
    expect(await history()).toHaveLength(2);
    expect(await history(true)).toEqual([]);
  });

  it('restores an active simulation idempotently', async () => {
    const response = await restore(simulationIds[40]).expect(200);

    expect(response.body.archivedAt).toBeNull();
  });

  it.each(['archive', 'restore'] as const)(
    'returns SIMULATION_NOT_FOUND when %s targets an unknown simulation',
    async (operation) => {
      const response = await request(context.app)
        .post(`/simulations/9999/${operation}`)
        .expect(404);

      expect(response.body.error.code).toBe('SIMULATION_NOT_FOUND');
    },
  );

  it.each(['abc', '0', '1.0'])('rejects malformed simulation id %s', async (id) => {
    const response = await request(context.app)
      .post(`/simulations/${id}/archive`)
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it.each(['si', '1'])('rejects archived=%s', async (archived) => {
    const response = await request(context.app)
      .get(`/customers/${customerId}/simulations?archived=${archived}`)
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.message).toBe('archived debe ser true o false');
  });

  it('counts archive requests against the write limit', async () => {
    replaceContextWithWriteLimit(3);
    await createFixtureData();

    const response = await archive(simulationIds[15]).expect(429);

    expect(response.body.error.code).toBe('RATE_LIMITED');
  });

  it('counts restore requests against the write limit', async () => {
    replaceContextWithWriteLimit(4);
    await createFixtureData();
    await archive(simulationIds[15]).expect(200);

    const response = await restore(simulationIds[15]).expect(429);

    expect(response.body.error.code).toBe('RATE_LIMITED');
  });

  async function createFixtureData(): Promise<void> {
    const customer = await request(context.app)
      .post('/customers')
      .send(validCustomer)
      .expect(201);
    customerId = customer.body.id as number;
    simulationIds = {
      15: await createSimulation(15),
      40: await createSimulation(40),
    };
  }

  function replaceContextWithWriteLimit(writeLimit: number): void {
    context.database.close();
    context = createTestContext(
      {},
      { rateLimits: { windowMs: 60_000, writeLimit, generalLimit: HIGH_LIMIT } },
    );
  }

  async function createSimulation(users: 15 | 40): Promise<number> {
    const response = await request(context.app)
      .post('/simulations')
      .send({ customerId, users })
      .expect(201);
    return response.body.id as number;
  }

  async function history(archived = false): Promise<unknown[]> {
    const query = archived ? '?archived=true' : '';
    const response = await request(context.app)
      .get(`/customers/${customerId}/simulations${query}`)
      .expect(200);
    return response.body as unknown[];
  }

  function archive(id: number) {
    return request(context.app).post(`/simulations/${id}/archive`);
  }

  function restore(id: number) {
    return request(context.app).post(`/simulations/${id}/restore`);
  }
});
