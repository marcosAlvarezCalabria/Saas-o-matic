import { describe, expect, it } from 'vitest';

import { paginate } from './pagination';

const items = Array.from({ length: 12 }, (_, index) => index + 1);

describe('paginate', () => {
  it('returns the first page and its metadata', () => {
    expect(paginate(items, 1, 5)).toEqual({
      items: [1, 2, 3, 4, 5],
      page: 1,
      pageCount: 3,
    });
  });

  it('returns the last partial page', () => {
    expect(paginate(items, 3, 5)).toEqual({
      items: [11, 12],
      page: 3,
      pageCount: 3,
    });
  });

  it('clamps pages outside the available range', () => {
    expect(paginate(items, 9, 5).page).toBe(3);
    expect(paginate(items, 0, 5).page).toBe(1);
  });

  it('returns an empty first page for an empty list', () => {
    expect(paginate([], 1, 5)).toEqual({
      items: [],
      page: 1,
      pageCount: 1,
    });
  });
});
