import { DomainError } from '../errors.js';

const VAT_RATES: Readonly<Record<string, number>> = {
  ES: 21,
  PT: 23,
  FR: 20,
  DE: 19,
  IT: 22,
  NL: 21,
  IE: 23,
  GB: 20,
};

export function getVatRate(country: string): number {
  const vatRate = VAT_RATES[country];

  if (vatRate === undefined) {
    throw new DomainError('COUNTRY_NOT_SUPPORTED', 'país no soportado');
  }

  return vatRate;
}

export function calculateVat(baseCents: number, vatRate: number): number {
  return Math.round((baseCents * vatRate) / 100);
}
