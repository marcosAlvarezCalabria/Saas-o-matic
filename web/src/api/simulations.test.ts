import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  archiveSimulation,
  listSimulations,
  restoreSimulation,
} from './simulations';
import type { Simulation } from './types';

const simulation: Simulation = {
  id: 7,
  customerId: 1,
  users: 15,
  storageGb: 100,
  apiCalls: 50_000,
  baseCents: 14_000,
  vatRateBasisPoints: 2_100,
  vatCents: 2_940,
  totalCents: 16_940,
  createdAt: '2026-11-24T12:00:00.000Z',
  archivedAt: null,
};

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('simulations API', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('lists active simulations by default', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([simulation]));
    vi.stubGlobal('fetch', fetchMock);

    await expect(listSimulations(1)).resolves.toEqual([simulation]);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/customers/1/simulations',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('lists archived simulations when requested', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([simulation]));
    vi.stubGlobal('fetch', fetchMock);

    await listSimulations(1, { archived: true });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/customers/1/simulations?archived=true',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it.each([
    ['archiveSimulation', archiveSimulation, '/simulations/7/archive'],
    ['restoreSimulation', restoreSimulation, '/simulations/7/restore'],
  ] as const)('%s posts the action and returns the simulation', async (_, action, path) => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(simulation));
    vi.stubGlobal('fetch', fetchMock);

    await expect(action(7)).resolves.toEqual(simulation);
    expect(fetchMock).toHaveBeenCalledWith(
      `https://api.example.test${path}`,
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
