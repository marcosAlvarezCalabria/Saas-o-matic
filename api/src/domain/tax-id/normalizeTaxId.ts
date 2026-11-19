export function normalizeTaxId(taxId: string): string {
  return taxId.toUpperCase().replace(/[\s-]/g, '');
}
