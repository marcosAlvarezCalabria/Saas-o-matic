import { request } from './apiClient';
import type {
  CostBreakdown,
  CreateSimulationInput,
  PreviewInput,
  Simulation,
} from './types';

export function previewSimulation(
  input: PreviewInput,
  signal?: AbortSignal,
): Promise<CostBreakdown> {
  return request<CostBreakdown>('/simulations/preview', {
    method: 'POST',
    body: input,
    signal,
  });
}

export function createSimulation(
  input: CreateSimulationInput,
): Promise<Simulation> {
  return request<Simulation>('/simulations', {
    method: 'POST',
    body: input,
  });
}

export function listSimulations(
  customerId: number,
  { archived = false }: { archived?: boolean } = {},
  signal?: AbortSignal,
): Promise<Simulation[]> {
  const query = archived ? '?archived=true' : '';
  return request<Simulation[]>(`/customers/${customerId}/simulations${query}`, {
    signal,
  });
}

export function archiveSimulation(id: number): Promise<Simulation> {
  return request<Simulation>(`/simulations/${id}/archive`, { method: 'POST' });
}

export function restoreSimulation(id: number): Promise<Simulation> {
  return request<Simulation>(`/simulations/${id}/restore`, { method: 'POST' });
}
