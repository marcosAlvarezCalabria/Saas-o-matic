import { describe, expect, it } from 'vitest';

import { formatVatRate } from './vatRate';

describe('formatVatRate', () => {
  it.each([
    [2_100, '21\u00a0%'],
    [2_550, '25,5\u00a0%'],
    [0, '0\u00a0%'],
  ])('formats %i basis points as %s', (basisPoints, expected) => {
    expect(formatVatRate(basisPoints)).toBe(expected);
  });
});
