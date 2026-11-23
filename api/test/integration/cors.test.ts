import { afterEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { createTestContext, type TestContext } from './testContext.js';

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://saas-o-matic.netlify.app',
];

describe('CORS', () => {
  let context: TestContext;

  afterEach(() => {
    context.database.close();
  });

  it.each(ALLOWED_ORIGINS)('allows origin %s', async (origin) => {
    context = createTestContext({}, { corsOrigins: ALLOWED_ORIGINS });

    const response = await request(context.app).get('/health').set('Origin', origin).expect(200);
    expect(response.headers['access-control-allow-origin']).toBe(origin);
  });

  it('handles a POST preflight request', async () => {
    context = createTestContext({}, { corsOrigins: ALLOWED_ORIGINS });

    const response = await request(context.app)
      .options('/simulations')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type')
      .expect(204);

    expect(response.headers['access-control-allow-methods']).toContain('POST');
    expect(response.headers['access-control-allow-headers']?.toLowerCase()).toContain('content-type');
  });

  it('does not add the allow-origin header for an unknown origin', async () => {
    context = createTestContext({}, { corsOrigins: ALLOWED_ORIGINS });

    const response = await request(context.app)
      .get('/health')
      .set('Origin', 'https://otra-web.com')
      .expect(200);
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('allows the development frontend by default', async () => {
    context = createTestContext();

    const response = await request(context.app)
      .get('/health')
      .set('Origin', 'http://localhost:5173')
      .expect(200);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });
});
