import { DomainError } from '../errors.js';
import { isValidGenericTaxId } from './genericTaxId.js';
import { normalizeTaxId } from './normalizeTaxId.js';
import { isValidSpanishTaxId } from './spanishTaxId.js';

type TaxIdValidator = (taxId: string) => boolean;

const COUNTRY_VALIDATORS: Readonly<Partial<Record<string, TaxIdValidator>>> = {
  ES: isValidSpanishTaxId,
};

export function validateTaxId(country: string, taxId: string): string {
  const normalizedTaxId = normalizeTaxId(taxId);
  const validator = COUNTRY_VALIDATORS[country] ?? isValidGenericTaxId;

  if (!validator(normalizedTaxId)) {
    throw new DomainError('INVALID_TAX_ID', 'identificador fiscal no válido');
  }

  return normalizedTaxId;
}
