import { describe, expect, it } from 'vitest';

import {
  normalizeCompanyNameForSearch,
  validateCustomerFields,
} from '../../../src/domain/customer.js';
import { DomainError } from '../../../src/domain/errors.js';

const validCustomer = {
  companyName: 'Acme Ibérica S.L.',
  email: 'compras@acme.es',
  country: 'ES',
  plan: 'pro',
};

describe('validateCustomerFields', () => {
  it.each([
    { field: 'companyName', value: 'A' },
    { field: 'companyName', value: '   ' },
    { field: 'email', value: 'compras.acme.es' },
    { field: 'email', value: 'compras@acme' },
    { field: 'email', value: 'com pras@acme.es' },
    { field: 'plan', value: 'gold' },
    { field: 'country', value: 'ESP' },
    { field: 'country', value: 'E1' },
  ])('rejects invalid $field: $value', ({ field, value }) => {
    expectValidationError({ ...validCustomer, [field]: value });
  });

  it.each(['es', 'Es', ' ES '])('normalizes country %j to ES', (country) => {
    expect(validateCustomerFields({ ...validCustomer, country }).country).toBe('ES');
  });

  it('rejects a company name with 101 characters', () => {
    expectValidationError({ ...validCustomer, companyName: 'A'.repeat(101) });
  });
});

describe('normalizeCompanyNameForSearch', () => {
  it.each([
    { name: 'Café Ibérico S.L.', expected: 'cafe iberico s.l.' },
    { name: '  ACME Ibérica  ', expected: 'acme iberica' },
    { name: 'Ñandú Logística', expected: 'nandu logistica' },
  ])('normalizes $name for search', ({ name, expected }) => {
    expect(normalizeCompanyNameForSearch(name)).toBe(expected);
  });
});

function expectValidationError(input: Record<string, string>): void {
  let thrownError: unknown;

  try {
    validateCustomerFields(input);
  } catch (error) {
    thrownError = error;
  }

  expect(thrownError).toBeInstanceOf(DomainError);
  expect(thrownError).toMatchObject({ code: 'VALIDATION_ERROR' });
}
