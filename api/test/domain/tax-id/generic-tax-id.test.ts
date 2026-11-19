import { describe, expect, it } from 'vitest';

import { DomainError } from '../../../src/domain/errors.js';
import { validateTaxId } from '../../../src/domain/tax-id/validateTaxId.js';

function expectInvalidGenericTaxId(country: string, taxId: string): void {
  let thrownError: unknown;

  try {
    validateTaxId(country, taxId);
  } catch (error) {
    thrownError = error;
  }

  expect(thrownError).toBeInstanceOf(DomainError);
  expect(thrownError).toMatchObject({ code: 'INVALID_TAX_ID' });
}

describe('validateTaxId for other countries', () => {
  it.each([
    { country: 'FR', taxId: 'FR12345678901', expected: 'valid' },
    { country: 'DE', taxId: 'DE123456789', expected: 'valid' },
    { country: 'GB', taxId: '123', expected: 'rejected' },
    { country: 'FR', taxId: 'FR123$456', expected: 'rejected' },
    { country: 'DE', taxId: 'DE1234567890123456789', expected: 'rejected' },
  ])('$country $taxId is $expected', ({ country, taxId, expected }) => {
    if (expected === 'valid') {
      expect(() => validateTaxId(country, taxId)).not.toThrow();
      return;
    }

    expectInvalidGenericTaxId(country, taxId);
  });
});
