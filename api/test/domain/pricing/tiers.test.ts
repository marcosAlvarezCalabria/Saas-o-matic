import { describe, expect, it } from 'vitest';

import { DomainError } from '../../../src/domain/errors.js';
import { calculateBaseCost } from '../../../src/domain/pricing/tiers.js';

describe('calculateBaseCost', () => {
  it.each([
    { users: 1, expectedCents: 1_000 },
    { users: 10, expectedCents: 10_000 },
    { users: 11, expectedCents: 10_800 },
    { users: 15, expectedCents: 14_000 },
    { users: 50, expectedCents: 42_000 },
    { users: 51, expectedCents: 42_500 },
    { users: 1000, expectedCents: 517_000 },
    { users: 100_000, expectedCents: 50_017_000 },
  ])('returns $expectedCents cents for $users users', ({ users, expectedCents }) => {
    expect(calculateBaseCost(users)).toBe(expectedCents);
  });

  it.each([0, -5, 2.5, 100_001])('rejects invalid user count: %s', (users) => {
    let thrownError: unknown;

    try {
      calculateBaseCost(users);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(DomainError);
    expect(thrownError).toMatchObject({ code: 'VALIDATION_ERROR' });
  });
});
