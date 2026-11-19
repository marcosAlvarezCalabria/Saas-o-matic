import { describe, expect, it } from 'vitest';

import { DomainError } from '../../../src/domain/errors.js';
import { validateTaxId } from '../../../src/domain/tax-id/validateTaxId.js';

function expectInvalidSpanishTaxId(taxId: string): void {
  let thrownError: unknown;

  try {
    validateTaxId('ES', taxId);
  } catch (error) {
    thrownError = error;
  }

  expect(thrownError).toBeInstanceOf(DomainError);
  expect(thrownError).toMatchObject({ code: 'INVALID_TAX_ID' });
}

describe('validateTaxId for Spain', () => {
  describe('DNI', () => {
    it.each(['12345678Z', '00000000T', '99999999R'])('accepts valid DNI: %s', (taxId) => {
      expect(() => validateTaxId('ES', taxId)).not.toThrow();
    });

    it.each(['12345678A', '1234567Z', '123456789Z', '12345678', '1234567ZZ'])(
      'rejects invalid DNI: %s',
      (taxId) => {
        expectInvalidSpanishTaxId(taxId);
      },
    );
  });

  describe('NIE', () => {
    it.each(['X1234567L', 'Y1234567X', 'Z1234567R'])('accepts valid NIE: %s', (taxId) => {
      expect(() => validateTaxId('ES', taxId)).not.toThrow();
    });

    it.each(['X1234567A', 'W1234567L', 'X123456L'])('rejects invalid NIE: %s', (taxId) => {
      expectInvalidSpanishTaxId(taxId);
    });
  });

  describe('CIF', () => {
    it.each([
      'B58754201',
      'A58754201',
      'Q2826000H',
      'P0800000B',
      'N0012345E',
      'G12345674',
      'G1234567D',
    ])('accepts valid CIF: %s', (taxId) => {
      expect(() => validateTaxId('ES', taxId)).not.toThrow();
    });

    it.each(['B58754202', 'B5875420A', 'Q28260008', 'Q2826000A', 'I1234567D', 'B587542'])(
      'rejects invalid CIF: %s',
      (taxId) => {
        expectInvalidSpanishTaxId(taxId);
      },
    );
  });

  it('rejects a foreign identifier for country ES', () => {
    expectInvalidSpanishTaxId('FR12345678901');
  });
});
