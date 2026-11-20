import { DomainError } from '../errors.js';

const VAT_RATE_BASIS_POINTS: Readonly<Record<string, number>> = {
  AT: 2_000,
  BE: 2_100,
  BG: 2_000,
  CY: 1_900,
  CZ: 2_100,
  DE: 1_900,
  DK: 2_500,
  EE: 2_400,
  ES: 2_100,
  FI: 2_550,
  FR: 2_000,
  GB: 2_000,
  GR: 2_400,
  HR: 2_500,
  HU: 2_700,
  IE: 2_300,
  IT: 2_200,
  LT: 2_100,
  LU: 1_700,
  LV: 2_100,
  MT: 1_800,
  NL: 2_100,
  PL: 2_300,
  PT: 2_300,
  RO: 2_100,
  SE: 2_500,
  SI: 2_200,
  SK: 2_300,
};

export function getVatRateBasisPoints(country: string): number {
  const vatRateBasisPoints = VAT_RATE_BASIS_POINTS[country];

  if (vatRateBasisPoints === undefined) {
    throw new DomainError('COUNTRY_NOT_SUPPORTED', 'país no soportado');
  }

  return vatRateBasisPoints;
}

export function calculateVat(baseCents: number, vatRateBasisPoints: number): number {
  return Math.round((baseCents * vatRateBasisPoints) / 10_000);
}
