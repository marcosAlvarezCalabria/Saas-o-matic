import { describe, expect, it } from 'vitest';

import { DomainError } from '../../../src/domain/errors.js';
import { validateUsage } from '../../../src/domain/simulation.js';

describe('validateUsage', () => {
  it.each([
    {
      input: { storageGb: 100, apiCalls: 50_000 },
      expected: { storageGb: 100, apiCalls: 50_000 },
    },
    {
      input: { storageGb: 0, apiCalls: 0 },
      expected: { storageGb: 0, apiCalls: 0 },
    },
    {
      input: {},
      expected: { storageGb: 0, apiCalls: 0 },
    },
  ])('returns normalized usage for $input', ({ input, expected }) => {
    expect(validateUsage(input)).toEqual(expected);
  });

  it.each([
    { storageGb: -1, apiCalls: 0 },
    { storageGb: 1.5, apiCalls: 0 },
    { storageGb: 0, apiCalls: -1 },
    { storageGb: 0, apiCalls: 1.5 },
    { storageGb: 9_007_199_254_740_992, apiCalls: 0 },
    { storageGb: 0, apiCalls: 9_007_199_254_740_992 },
  ])('rejects invalid usage: %o', (input) => {
    let thrownError: unknown;

    try {
      validateUsage(input);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(DomainError);
    expect(thrownError).toMatchObject({ code: 'VALIDATION_ERROR' });
  });
});
