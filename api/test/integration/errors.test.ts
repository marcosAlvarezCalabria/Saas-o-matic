import { afterEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

import { createTestContext, type TestContext } from './testContext.js';

describe('unexpected errors', () => {
  let context: TestContext;

  afterEach(() => {
    context.database.close();
  });

  it('logs the error without exposing its details in the response', async () => {
    const internalError = new Error('fallo interno de prueba');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    context = createTestContext({
      getCustomer: {
        execute() {
          throw internalError;
        },
      },
    });

    try {
      const response = await request(context.app).get('/customers/1').expect(500);
      const responseBody = JSON.stringify(response.body);

      expect(response.body.error.code).toBe('INTERNAL_ERROR');
      expect(responseBody).not.toContain('fallo interno de prueba');
      expect(responseBody).not.toContain('    at ');
      expect(consoleError).toHaveBeenCalledOnce();
      expect(consoleError).toHaveBeenCalledWith(internalError);
    } finally {
      consoleError.mockRestore();
    }
  });
});
