export function isValidGenericTaxId(taxId: string): boolean {
  return /^[A-Z0-9]{4,20}$/.test(taxId);
}
