import { DomainError } from '../errors.js';

const FIRST_TIER_LIMIT = 10;
const SECOND_TIER_LIMIT = 50;

const FIRST_TIER_RATE_CENTS = 1_000;
const SECOND_TIER_RATE_CENTS = 800;
const THIRD_TIER_RATE_CENTS = 500;

export function calculateBaseCost(users: number): number {
  if (!Number.isInteger(users) || users < 1) {
    throw new DomainError('VALIDATION_ERROR', 'usuarios no válidos');
  }

  const firstTierUsers = Math.min(users, FIRST_TIER_LIMIT);
  const secondTierUsers = Math.min(
    Math.max(users - FIRST_TIER_LIMIT, 0),
    SECOND_TIER_LIMIT - FIRST_TIER_LIMIT,
  );
  const thirdTierUsers = Math.max(users - SECOND_TIER_LIMIT, 0);

  return (
    firstTierUsers * FIRST_TIER_RATE_CENTS +
    secondTierUsers * SECOND_TIER_RATE_CENTS +
    thirdTierUsers * THIRD_TIER_RATE_CENTS
  );
}
