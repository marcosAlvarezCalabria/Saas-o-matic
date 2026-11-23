import { describe, expect, it } from 'vitest';

import { COUNTRIES } from './countries';

describe('COUNTRIES', () => {
  it('contains the 27 EU countries and the United Kingdom once', () => {
    const codes = COUNTRIES.map(({ code }) => code);

    expect(COUNTRIES).toHaveLength(28);
    expect(new Set(codes)).toHaveLength(28);
    expect(codes).toContain('GB');
    expect(codes).toContain('GR');
    expect(codes).not.toContain('EL');
    expect(codes).not.toContain('UK');
    expect(codes).not.toContain('US');
    expect(codes).not.toContain('CH');
  });

  it('is sorted by country name in Spanish', () => {
    const names = COUNTRIES.map(({ name }) => name);
    const sortedNames = [...names].sort((left, right) =>
      left.localeCompare(right, 'es'),
    );

    expect(names).toEqual(sortedNames);
  });
});
