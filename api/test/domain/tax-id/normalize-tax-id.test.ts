import { describe, expect, it } from 'vitest';

import { normalizeTaxId } from '../../../src/domain/tax-id/normalizeTaxId.js';

describe('normalizeTaxId', () => {
  it.each([
    { input: '12345678z', expected: '12345678Z' },
    { input: '12345678-Z', expected: '12345678Z' },
    { input: '12 345 678 z', expected: '12345678Z' },
    { input: 'x-1234567-l', expected: 'X1234567L' },
  ])('normalizes "$input" to "$expected"', ({ input, expected }) => {
    expect(normalizeTaxId(input)).toBe(expected);
  });
});
