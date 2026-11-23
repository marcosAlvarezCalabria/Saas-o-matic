import { useCallback, useState } from 'react';

import { saveTheme, type Theme } from '../lib/theme';

function readDocumentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function persistTheme(theme: Theme): void {
  try {
    saveTheme(window.localStorage, theme);
  } catch {
    return;
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readDocumentTheme);

  const toggle = useCallback(() => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = nextTheme;
      persistTheme(nextTheme);
      return nextTheme;
    });
  }, []);

  return { theme, toggle };
}
