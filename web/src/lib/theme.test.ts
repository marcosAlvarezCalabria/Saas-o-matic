import { describe, expect, it } from 'vitest';

import { readStoredTheme, resolveTheme } from './theme';

describe('resolveTheme', () => {
  it('gives precedence to a valid stored theme', () => {
    expect(resolveTheme('dark', false)).toBe('dark');
    expect(resolveTheme('light', true)).toBe('light');
  });

  it('falls back to the system preference', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme('azul', false)).toBe('light');
  });
});

describe('readStoredTheme', () => {
  it('returns null when storage is unavailable', () => {
    const storage = {
      getItem() {
        throw new Error('Storage unavailable');
      },
    };

    expect(readStoredTheme(storage)).toBeNull();
  });
});
