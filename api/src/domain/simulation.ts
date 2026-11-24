import { DomainError } from './errors.js';
import type { CostBreakdown } from './pricing/calculateMonthlyCost.js';

export interface Simulation extends CostBreakdown {
  id: number;
  customerId: number;
  users: number;
  storageGb: number;
  apiCalls: number;
  createdAt: string;
  archivedAt: string | null;
}

export interface UsageInput {
  storageGb?: number;
  apiCalls?: number;
}

export interface Usage {
  storageGb: number;
  apiCalls: number;
}

export function validateUsage(input: UsageInput): Usage {
  const storageGb = input.storageGb ?? 0;
  const apiCalls = input.apiCalls ?? 0;

  if (!isValidUsageValue(storageGb) || !isValidUsageValue(apiCalls)) {
    throw new DomainError('VALIDATION_ERROR', 'uso no válido');
  }

  return { storageGb, apiCalls };
}

function isValidUsageValue(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0;
}
