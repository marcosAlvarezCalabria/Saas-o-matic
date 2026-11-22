import type { CreateSimulationInput } from '../../application/use-cases/simulations/createSimulation.js';
import type { PreviewSimulationInput } from '../../application/use-cases/simulations/previewSimulation.js';
import { isRecord } from './inputValidation.js';

export function parsePreviewInput(body: unknown): PreviewSimulationInput | null {
  if (!hasRequiredFields(body)) {
    return null;
  }

  return {
    customerId: body.customerId,
    users: body.users,
  };
}

export function parseCreateSimulationInput(body: unknown): CreateSimulationInput | null {
  if (!hasRequiredFields(body)) {
    return null;
  }

  if ('storageGb' in body && typeof body.storageGb !== 'number') {
    return null;
  }

  if ('apiCalls' in body && typeof body.apiCalls !== 'number') {
    return null;
  }

  return {
    customerId: body.customerId,
    users: body.users,
    ...('storageGb' in body ? { storageGb: body.storageGb as number } : {}),
    ...('apiCalls' in body ? { apiCalls: body.apiCalls as number } : {}),
  };
}

function hasRequiredFields(
  body: unknown,
): body is Record<string, unknown> & { customerId: number; users: number } {
  return (
    isRecord(body) &&
    Number.isSafeInteger(body.customerId) &&
    (body.customerId as number) >= 1 &&
    typeof body.users === 'number'
  );
}
