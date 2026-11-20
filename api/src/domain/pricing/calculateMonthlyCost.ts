import { calculateBaseCost } from './tiers.js';
import { calculateVat, getVatRateBasisPoints } from './vat.js';

export interface CostBreakdown {
  baseCents: number;
  vatRateBasisPoints: number;
  vatCents: number;
  totalCents: number;
}

export function calculateMonthlyCost(country: string, users: number): CostBreakdown {
  const baseCents = calculateBaseCost(users);
  const vatRateBasisPoints = getVatRateBasisPoints(country);
  const vatCents = calculateVat(baseCents, vatRateBasisPoints);

  return {
    baseCents,
    vatRateBasisPoints,
    vatCents,
    totalCents: baseCents + vatCents,
  };
}
