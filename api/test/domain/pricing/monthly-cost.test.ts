import { describe, expect, it } from 'vitest';

import { DomainError } from '../../../src/domain/errors.js';
import { calculateMonthlyCost } from '../../../src/domain/pricing/calculateMonthlyCost.js';

describe('calculateMonthlyCost', () => {
  it('adds Spanish VAT to the base cost for 15 users', () => {
    expect(calculateMonthlyCost('ES', 15)).toEqual({
      baseCents: 14_000,
      vatRateBasisPoints: 2_100,
      vatCents: 2_940,
      totalCents: 16_940,
    });
  });

  it('rounds Finnish VAT to the nearest cent for 51 users', () => {
    expect(calculateMonthlyCost('FI', 51)).toEqual({
      baseCents: 42_500,
      vatRateBasisPoints: 2_550,
      vatCents: 10_838,
      totalCents: 53_338,
    });
  });

  it('rejects a country without a supported VAT rate', () => {
    let thrownError: unknown;

    try {
      calculateMonthlyCost('US', 15);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(DomainError);
    expect(thrownError).toMatchObject({ code: 'COUNTRY_NOT_SUPPORTED' });
  });
});
