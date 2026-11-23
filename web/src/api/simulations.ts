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
  signal?: AbortSignal,
): Promise<Simulation[]> {
  return request<Simulation[]>(`/customers/${customerId}/simulations`, {
    signal,
  });
}
