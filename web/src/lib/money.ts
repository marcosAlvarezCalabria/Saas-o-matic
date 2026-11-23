export function convertCents(cents: number, rate: number): number {
  return (cents / 100) * rate;
}

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount);
}
