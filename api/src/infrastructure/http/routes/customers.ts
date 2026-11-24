import { Router } from 'express';

import type { CreateCustomer } from '../../../application/use-cases/customers/createCustomer.js';
import type { GetCustomer } from '../../../application/use-cases/customers/getCustomer.js';
import type { SearchCustomers } from '../../../application/use-cases/customers/searchCustomers.js';
import { validationErrorBody } from '../errorHandler.js';
import { parseCreateCustomerInput, parsePositiveId } from '../inputValidation.js';

export interface CustomerUseCases {
  createCustomer: CreateCustomer;
  getCustomer: GetCustomer;
  searchCustomers: SearchCustomers;
}

export function createCustomerRouter(useCases: CustomerUseCases): Router {
  const router = Router();

  router.post('/', (request, response) => {
    const input = parseCreateCustomerInput(request.body);

    if (input === null) {
      response.status(400).json(validationErrorBody('Faltan campos o tienen un tipo incorrecto'));
      return;
    }

    response.status(201).json(useCases.createCustomer.execute(input));
  });

  router.get('/', (request, response) => {
    const search = request.query.search;

    if (search !== undefined && typeof search !== 'string') {
      response.status(400).json(validationErrorBody('La búsqueda debe ser texto'));
      return;
    }

    response.status(200).json(useCases.searchCustomers.execute(search));
  });

  router.get('/:id', (request, response) => {
    const id = parsePositiveId(request.params.id ?? '');

    if (id === null) {
      response.status(400).json(validationErrorBody('El id debe ser un entero positivo'));
      return;
    }

    response.status(200).json(useCases.getCustomer.execute(id));
  });

  return router;
}
