import { describe, expect, it } from 'vitest';

import type { Simulation } from '../api/types';
import { isSimulationSaved } from './duplicates';

const simulation: Simulation = {
  id: 1,
  customerId: 1,
  users: 15,
  storageGb: 100,
  apiCalls: 50_000,
  baseCents: 14_000,
  vatRateBasisPoints: 2_100,
  vatCents: 2_940,
  totalCents: 16_940,
  createdAt: '2026-11-22T12:00:00.000Z',
  archivedAt: null,
};

const values = { users: 15, storageGb: 100, apiCalls: 50_000 };

describe('isSimulationSaved', () => {
  it('finds a simulation with the same input values', () => {
    expect(isSimulationSaved([simulation], values)).toBe(true);
  });

  it.each([
    { ...values, users: 16 },
    { ...values, storageGb: 101 },
    { ...values, apiCalls: 50_001 },
  ])('does not match when one input changes', (differentValues) => {
    expect(isSimulationSaved([simulation], differentValues)).toBe(false);
  });

  it('returns false for an empty history', () => {
    expect(isSimulationSaved([], values)).toBe(false);
  });
});
