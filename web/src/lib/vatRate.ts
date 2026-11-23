const percentageFormatter = new Intl.NumberFormat('es-ES', {
  style: 'percent',
  maximumFractionDigits: 2,
});

export function formatVatRate(basisPoints: number): string {
  return percentageFormatter.format(basisPoints / 10_000);
}
