import type { Customer, Simulation } from '../api/types';
import { convertCents, formatMoney } from './money';
import { formatVatRate } from './vatRate';

export interface SimulationConversion {
  currency: string;
  rate: number;
  ratesDate: string;
}

const dateFormatter = new Intl.DateTimeFormat('es-ES');

export function buildSimulationMailto(
  customer: Customer,
  simulation: Simulation,
  conversion: SimulationConversion | null,
): string {
  const subject = `Simulación de SaaS-O-Matic para ${customer.companyName}`;
  const lines = [
    'Hola,',
    '',
    'Te envío la simulación del coste mensual de vuestra suscripción:',
    '',
    `Fecha: ${dateFormatter.format(new Date(simulation.createdAt))}`,
    `Usuarios: ${simulation.users}`,
    `Almacenamiento: ${simulation.storageGb} GB (informativo)`,
    `Llamadas a la API: ${simulation.apiCalls} / mes (informativo)`,
    '',
    `Base: ${formatMoney(convertCents(simulation.baseCents, 1), 'EUR')}`,
    `IVA (${formatVatRate(simulation.vatRateBasisPoints)}): ${formatMoney(convertCents(simulation.vatCents, 1), 'EUR')}`,
    `Total mensual: ${formatMoney(convertCents(simulation.totalCents, 1), 'EUR')}`,
  ];

  if (conversion !== null) {
    lines.push(
      `Equivale a ≈ ${formatMoney(convertCents(simulation.totalCents, conversion.rate), conversion.currency)} al tipo de cambio del ${conversion.ratesDate}.`,
    );
  }

  lines.push('', 'Un saludo');
  const body = lines.join('\r\n');

  return `mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
