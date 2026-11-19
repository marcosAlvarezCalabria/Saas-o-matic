import { describe, expect, it } from 'vitest';

import { calculateBaseCost } from '../../../src/domain/pricing/tiers.js';

describe('calculateBaseCost', () => {
  it.each([
    { users: 1, expectedCents: 1_000 },
    { users: 10, expectedCents: 10_000 },
    { users: 11, expectedCents: 10_800 },
    { users: 15, expectedCents: 14_000 },
    { users: 50, expectedCents: 42_000 },
    { users: 51, expectedCents: 42_500 },
  ])('returns $expectedCents cents for $users users', ({ users, expectedCents }) => {
    expect(calculateBaseCost(users)).toBe(expectedCents);
  });

  it.each([0, -5, 2.5])('rejects invalid user count: %s', (users) => {
    expect(() => calculateBaseCost(users)).toThrow('usuarios no válidos');
  });
});
