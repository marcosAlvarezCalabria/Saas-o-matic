import { describe, expect, it } from 'vitest';

import { parseCorsOrigins } from '../../src/infrastructure/http/corsOrigins.js';

describe('parseCorsOrigins', () => {
  it.each([
    { value: undefined, expected: ['http://localhost:5173'] },
    { value: '', expected: ['http://localhost:5173'] },
    { value: 'a, b ,c', expected: ['a', 'b', 'c'] },
  ])('parses $value as $expected', ({ value, expected }) => {
    expect(parseCorsOrigins(value)).toEqual(expected);
  });
});
