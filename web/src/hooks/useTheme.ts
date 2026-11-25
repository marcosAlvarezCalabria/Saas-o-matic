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
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    persistTheme(nextTheme);
    setTheme(nextTheme);
  }, [theme]);

  return { theme, toggle };
}
