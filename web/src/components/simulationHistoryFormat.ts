const dateFormatter = new Intl.DateTimeFormat('es-ES');
const integerFormatter = new Intl.NumberFormat('es-ES');

export function formatSimulationDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function formatSimulationUsage(
  storageGb: number,
  apiCalls: number,
): string {
  return `${integerFormatter.format(storageGb)} GB · ${integerFormatter.format(apiCalls)} / mes`;
}
