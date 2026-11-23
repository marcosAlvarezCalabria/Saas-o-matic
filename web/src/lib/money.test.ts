import { describe, expect, it } from 'vitest';

import { convertCents, formatMoney } from './money';

describe('money', () => {
  it('converts euro cents using the exchange rate without rounding', () => {
    expect(convertCents(16_940, 1)).toBe(169.4);
    expect(convertCents(16_940, 1.09)).toBeCloseTo(184.646, 10);
  });

  it('formats currencies in Spanish', () => {
    expect(formatMoney(169.4, 'EUR')).toBe('169,40\u00a0€');
    expect(formatMoney(184.646, 'USD')).toBe('184,65\u00a0US$');
  });
});
