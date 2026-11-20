import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { ApplicationError } from '../../src/application/errors.js';
import { SqliteCustomerRepository } from '../../src/infrastructure/db/SqliteCustomerRepository.js';
import { validCustomer } from './customerFixtures.js';
import {
  createCustomerTestContext,
  type CustomerTestContext,
} from './customerTestContext.js';

describe('POST /customers', () => {
  let context: CustomerTestContext;

  beforeEach(() => {
    context = createCustomerTestContext();
  });

  afterEach(() => {
    context.database.close();
  });

  it('creates and normalizes a valid customer', async () => {
    const response = await request(context.app)
      .post('/customers')
      .send({ ...validCustomer, companyName: '  Acme Ibérica S.L. ', taxId: 'b-58754201' })
      .expect(201);

    expect(response.body).toMatchObject({
      companyName: 'Acme Ibérica S.L.',
      taxId: 'B58754201',
      country: 'ES',
      plan: 'pro',
    });
    expect(response.body.id).toEqual(expect.any(Number));
    expect(response.body.createdAt).toEqual(expect.any(String));
  });

  it('rejects an invalid Spanish tax id', async () => {
    const response = await request(context.app)
      .post('/customers')
      .send({ ...validCustomer, taxId: 'B58754202' })
      .expect(400);

    expect(response.body.error.code).toBe('INVALID_TAX_ID');
  });

  it('rejects a country without a VAT rate', async () => {
    const response = await request(context.app)
      .post('/customers')
      .send({ ...validCustomer, country: 'US', taxId: '123456789' })
      .expect(400);

    expect(response.body.error.code).toBe('COUNTRY_NOT_SUPPORTED');
  });

  it('rejects a request without email', async () => {
    const response = await request(context.app)
      .post('/customers')
      .send({
        companyName: validCustomer.companyName,
        taxId: validCustomer.taxId,
        country: validCustomer.country,
        plan: validCustomer.plan,
      })
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects the same normalized tax id twice', async () => {
    await request(context.app)
      .post('/customers')
      .send({ ...validCustomer, taxId: '12345678Z' })
      .expect(201);

    const response = await request(context.app)
      .post('/customers')
      .send({ ...validCustomer, companyName: 'Otra empresa', taxId: '12345678-z' })
      .expect(409);

    expect(response.body.error.code).toBe('TAX_ID_ALREADY_EXISTS');
  });

  it('translates a database unique constraint into a duplicate tax id error', () => {
    const repository = new SqliteCustomerRepository(context.database);
    const customer = {
      companyName: 'Acme Ibérica S.L.',
      companyNameSearch: 'acme iberica s.l.',
      taxId: 'B58754201',
      email: 'compras@acme.es',
      country: 'ES',
      plan: 'pro' as const,
    };
    repository.create(customer);

    let thrownError: unknown;

    try {
      repository.create({ ...customer, companyName: 'Otra empresa' });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(ApplicationError);
    expect(thrownError).toMatchObject({ code: 'TAX_ID_ALREADY_EXISTS' });
  });
});
