import { calculateBaseCost } from './tiers.js';
import { calculateVat, getVatRate } from './vat.js';

export interface CostBreakdown {
  baseCents: number;
  vatRate: number;
  vatCents: number;
  totalCents: number;
}

export function calculateMonthlyCost(country: string, users: number): CostBreakdown {
  const baseCents = calculateBaseCost(users);
  const vatRate = getVatRate(country);
  const vatCents = calculateVat(baseCents, vatRate);

  return {
    baseCents,
    vatRate,
    vatCents,
    totalCents: baseCents + vatCents,
  };
}
