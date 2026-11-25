import { Router } from 'express';
import type { Response } from 'express';

import type { CreateSimulation } from '../../../application/use-cases/simulations/createSimulation.js';
import type { ArchiveSimulation } from '../../../application/use-cases/simulations/archiveSimulation.js';
import type { ListCustomerSimulations } from '../../../application/use-cases/simulations/listCustomerSimulations.js';
import type { PreviewSimulation } from '../../../application/use-cases/simulations/previewSimulation.js';
import type { RestoreSimulation } from '../../../application/use-cases/simulations/restoreSimulation.js';
import { validationErrorBody } from '../errorHandler.js';
import { parsePositiveId } from '../inputValidation.js';
import { parseCreateSimulationInput, parsePreviewInput } from '../simulationInput.js';

export interface SimulationUseCases {
  createSimulation: CreateSimulation;
  archiveSimulation: ArchiveSimulation;
  listCustomerSimulations: ListCustomerSimulations;
  previewSimulation: PreviewSimulation;
  restoreSimulation: RestoreSimulation;
}

export function createSimulationRouter(useCases: SimulationUseCases): Router {
  const router = Router();

  router.post('/simulations', (request, response) => {
    const input = parseCreateSimulationInput(request.body);

    if (input === null) {
      response.status(400).json(validationErrorBody('Faltan campos o tienen un tipo incorrecto'));
      return;
    }

    response.status(201).json(useCases.createSimulation.execute(input));
  });

  router.post('/simulations/preview', (request, response) => {
    const input = parsePreviewInput(request.body);

    if (input === null) {
      response.status(400).json(validationErrorBody('Faltan campos o tienen un tipo incorrecto'));
      return;
    }

    response.status(200).json(useCases.previewSimulation.execute(input));
  });

  router.get('/customers/:id/simulations', (request, response) => {
    const customerId = parsePositiveId(request.params.id ?? '');
    const archived = parseArchived(request.query.archived);

    if (customerId === null) {
      response.status(400).json(validationErrorBody('El id debe ser un entero positivo'));
      return;
    }

    if (archived === null) {
      response.status(400).json(validationErrorBody('archived debe ser true o false'));
      return;
    }

    response
      .status(200)
      .json(useCases.listCustomerSimulations.execute(customerId, { archived }));
  });

  router.post('/simulations/:id/archive', (request, response) => {
    executeSimulationAction(request.params.id, response, useCases.archiveSimulation);
  });

  router.post('/simulations/:id/restore', (request, response) => {
    executeSimulationAction(request.params.id, response, useCases.restoreSimulation);
  });

  return router;
}

function parseArchived(value: unknown): boolean | null {
  if (value === undefined || value === 'false') {
    return false;
  }

  return value === 'true' ? true : null;
}

function executeSimulationAction(
  rawId: string | undefined,
  response: Response,
  useCase: { execute(id: number): unknown },
): void {
  const id = parsePositiveId(rawId ?? '');

  if (id === null) {
    response.status(400).json(validationErrorBody('El id debe ser un entero positivo'));
    return;
  }

  response.status(200).json(useCase.execute(id));
}
