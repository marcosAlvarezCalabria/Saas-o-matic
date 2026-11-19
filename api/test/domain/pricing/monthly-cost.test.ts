import { describe, expect, it } from 'vitest';

import { calculateMonthlyCost } from '../../../src/domain/pricing/calculateMonthlyCost.js';

describe('calculateMonthlyCost', () => {
  it('adds Spanish VAT to the base cost for 15 users', () => {
    expect(calculateMonthlyCost('ES', 15)).toEqual({
      baseCents: 14_000,
      vatRate: 21,
      vatCents: 2_940,
      totalCents: 16_940,
    });
  });

  it('rejects a country without a supported VAT rate', () => {
    expect(() => calculateMonthlyCost('US', 15)).toThrow('país no soportado');
  });
});
