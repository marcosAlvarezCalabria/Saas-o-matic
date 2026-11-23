export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'saas-o-matic-theme';

interface ThemeStorageReader {
  getItem(key: string): string | null;
}

interface ThemeStorageWriter {
  setItem(key: string, value: string): void;
}

export function resolveTheme(
  storedTheme: string | null,
  prefersDark: boolean,
): Theme {
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return prefersDark ? 'dark' : 'light';
}

export function readStoredTheme(storage: ThemeStorageReader): string | null {
  try {
    return storage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveTheme(storage: ThemeStorageWriter, theme: Theme): void {
  try {
    storage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    return;
  }
}
