import { Router } from 'express';

import type { CreateSimulation } from '../../../application/use-cases/simulations/createSimulation.js';
import type { ListCustomerSimulations } from '../../../application/use-cases/simulations/listCustomerSimulations.js';
import type { PreviewSimulation } from '../../../application/use-cases/simulations/previewSimulation.js';
import { validationErrorBody } from '../errorHandler.js';
import { parseCustomerId } from '../inputValidation.js';
import { parseCreateSimulationInput, parsePreviewInput } from '../simulationInput.js';

export interface SimulationUseCases {
  createSimulation: CreateSimulation;
  listCustomerSimulations: ListCustomerSimulations;
  previewSimulation: PreviewSimulation;
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
    const customerId = parseCustomerId(request.params.id ?? '');

    if (customerId === null) {
      response.status(400).json(validationErrorBody('El id debe ser un entero positivo'));
      return;
    }

    response.status(200).json(useCases.listCustomerSimulations.execute(customerId));
  });

  return router;
}
