import { DomainError } from '../errors.js';

const FIRST_TIER_LIMIT = 10;
const SECOND_TIER_LIMIT = 50;
const MAX_USERS = 100_000;

const FIRST_TIER_RATE_CENTS = 1_000;
const SECOND_TIER_RATE_CENTS = 800;
const THIRD_TIER_RATE_CENTS = 500;

export function calculateBaseCost(users: number): number {
  validateUsers(users);

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

export function validateUsers(users: number): void {
  if (!Number.isSafeInteger(users) || users < 1 || users > MAX_USERS) {
    throw new DomainError('VALIDATION_ERROR', 'usuarios no válidos');
  }
}
