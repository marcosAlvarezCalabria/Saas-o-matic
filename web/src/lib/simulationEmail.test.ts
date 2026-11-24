import { describe, expect, it } from 'vitest';

import type { Customer, Simulation } from '../api/types';
import { buildSimulationMailto } from './simulationEmail';

const customer: Customer = {
  id: 1,
  companyName: 'Acme Ibérica S.L.',
  taxId: 'B58754201',
  email: 'compras@acme.es',
  country: 'ES',
  plan: 'pro',
  createdAt: '2026-11-20T12:00:00.000Z',
};

const simulation: Simulation = {
  id: 1,
  customerId: 1,
  users: 15,
  storageGb: 100,
  apiCalls: 50_000,
  baseCents: 14_000,
  vatRateBasisPoints: 2_100,
  vatCents: 2_940,
  totalCents: 16_940,
  createdAt: '2026-11-22T12:00:00.000Z',
};

function decodeMailto(mailto: string) {
  const query = mailto.split('?')[1] ?? '';
  const params = new URLSearchParams(query);

  return {
    subject: params.get('subject'),
    body: params.get('body'),
  };
}

const expectedBody = [
  'Hola,',
  '',
  'Te envío la simulación del coste mensual de vuestra suscripción:',
  '',
  'Fecha: 22/11/2026',
  'Usuarios: 15',
  'Almacenamiento: 100 GB (informativo)',
  'Llamadas a la API: 50000 / mes (informativo)',
  '',
  'Base: 140,00\u00a0€',
  'IVA (21\u00a0%): 29,40\u00a0€',
  'Total mensual: 169,40\u00a0€',
  '',
  'Un saludo',
].join('\r\n');

describe('buildSimulationMailto', () => {
  it('encodes the recipient, subject and euro body', () => {
    const mailto = buildSimulationMailto(customer, simulation, null);

    expect(mailto).toMatch(/^mailto:compras@acme\.es\?subject=/);
    expect(decodeMailto(mailto)).toEqual({
      subject: 'Simulación de SaaS-O-Matic para Acme Ibérica S.L.',
      body: expectedBody,
    });
    expect(decodeMailto(mailto).body).not.toContain('Equivale a');
  });

  it('adds the converted total and rates date for another currency', () => {
    const mailto = buildSimulationMailto(customer, simulation, {
      currency: 'USD',
      rate: 1.09,
      ratesDate: '22 de noviembre de 2026',
    });

    expect(decodeMailto(mailto).body).toBe(
      expectedBody.replace(
        '\r\n\r\nUn saludo',
        '\r\nEquivale a ≈ 184,65\u00a0US$ al tipo de cambio del 22 de noviembre de 2026.\r\n\r\nUn saludo',
      ),
    );
  });
});
